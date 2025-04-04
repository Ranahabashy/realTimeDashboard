import ProjectCardSkeleton from "@/components/skeleton/project-card";
import { KanbanBoardContainer, KanbanBoard } from "@/components/tasks/kanban/board";
import { KanbanColumn } from "@/components/tasks/kanban/column";
import KanbanItem from "@/components/tasks/kanban/KanbanItem";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mautations";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { TaskStage } from "@/graphql/schema.types";
import { TasksQuery } from "@/graphql/types";
import { DragEndEvent } from "@dnd-kit/core";
import { useList, useNavigation, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import React from "react";
import { KanbanAddCardButton } from "./add-card-button";
import { ProdjectCardMemo } from "./cards";

type Task = TasksQuery["tasks"]["nodes"][0]
type StageWithTasks = TaskStage & {
    tasks: Task[];
};

const List = ({ children }: React.PropsWithChildren) => {
    const { replace } = useNavigation();

    const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
        resource: 'taskStages',
        sorters: [{ field: "createdAt", order: "asc" }],
        filters: [
            {
                field: "title",
                operator: "in",
                value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE']
            }
        ],
        meta: {
            gqlQuery: TASK_STAGES_QUERY
        }
    });

    const { data: tasks, isLoading: isLoadingTasks } = useList<GetFieldsFromList<TasksQuery>>({
        resource: 'tasks',
        queryOptions: {
            enabled: !!stages
        },
        pagination: { mode: 'off' },
        sorters: [{ field: "dueDate", order: "asc" }],
        meta: {
            gqlQuery: TASKS_QUERY
        }
    });

    const { mutate: updateTask } = useUpdate();

    const isLoading = isLoadingStages || isLoadingTasks;

    const taskStages = React.useMemo(() => {
        if (!tasks?.data || !stages?.data) {
            return {
                unassignedStage: [],
                columns: [],
            };
        }

        const taskMap = new Map<string, Task>();
        tasks.data.forEach((task) => taskMap.set(task.id, task));
        const uniqueTasks = Array.from(taskMap.values());

        const stageTaskMap: Record<string, Task[]> = {};
        stages.data.forEach((stage) => {
            stageTaskMap[stage.id] = [];
        });

        const unassignedStage: Task[] = [];

        for (const task of uniqueTasks) {
            const sid = task.stageId?.toString();
            if (sid && stageTaskMap[sid]) {
                stageTaskMap[sid].push(task);
            } else {
                unassignedStage.push(task);
            }
        }

        const columns: StageWithTasks[] = stages.data.map((stage) => ({
            ...stage,
            tasks: stageTaskMap[stage.id] ?? [],
        }));
        ;

        return {
            unassignedStage,
            columns: columns,
        };
    }, [stages, tasks]);

    const handleAddCard = ({ stageId }: { stageId: string }) => {
        const path = stageId === 'unassigned'
            ? '/tasks/new'
            : `/tasks/new?stageId=${stageId}`;
        replace(path);
    };

    const handleOnDragEnd = (event: DragEndEvent) => {
        let stageId = event.over?.id as string | null | undefined;
        const taskId = event.active?.id as string;
        const taskStagedId = event.active.data.current?.stageId;

        if (taskStagedId === stageId) return;

        if (stageId === 'unassigned') {
            stageId = null;
        }

        updateTask({
            resource: 'tasks',
            id: taskId,
            values: {
                stageId,
            },
            successNotification: false,
            mutationMode: 'optimistic',
            meta: {
                gqlMutation: UPDATE_TASK_STAGE_MUTATION
            }
        });
    };

    if (isLoading) return <PageSkeleton />;

    return (
        <>
            <KanbanBoardContainer>
                <KanbanBoard onDragEnd={handleOnDragEnd}>
                    {/* Unassigned column */}
                    <KanbanColumn
                        id="unassigned"
                        title="Unassigned"
                        count={taskStages.unassignedStage.length}
                        onAddClick={() => handleAddCard({ stageId: "unassigned" })}
                    >
                        {taskStages.unassignedStage.map((task) => (
                            <KanbanItem
                                key={task.id}
                                id={task.id}
                                data={{ ...task, stageId: 'unassigned' }}
                            >
                                <ProdjectCardMemo
                                    {...task}
                                    dueDate={task.dueDate || undefined}
                                />
                            </KanbanItem>
                        ))}

                        {!taskStages.unassignedStage.length && (
                            <KanbanAddCardButton
                                onClick={() => handleAddCard({ stageId: 'unassigned' })}
                            />
                        )}
                    </KanbanColumn>

                    {/* Stage columns */}
                    {taskStages.columns.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            count={column.tasks.length}
                            onAddClick={() => handleAddCard({ stageId: column.id })}
                        >
                            {column.tasks.map((task) => (
                                <KanbanItem
                                    key={task.id}
                                    id={task.id}
                                    data={{
                                        type: "task", // ✅ required field
                                        columnId: column.id, // ✅ required field
                                        content: task.title, // ✅ optional, mapped from title
                                        stageId: column.id,  // ✅ same as before
                                    }}
                                >
                                    <ProdjectCardMemo
                                        {...task}
                                        dueDate={task.dueDate || undefined}
                                    />
                                </KanbanItem>
                            ))}

                            {!column.tasks.length && (
                                <KanbanAddCardButton
                                    onClick={() => handleAddCard({ stageId: column.id })}
                                />
                            )}
                        </KanbanColumn>
                    ))}
                </KanbanBoard>
            </KanbanBoardContainer>
            {children}
        </>
    );
};

export default List;

const PageSkeleton = () => {
    const columnCount = 6;
    const itemCount = 4;

    return (
        <KanbanBoardContainer>
            <KanbanBoard>
                {Array.from({ length: columnCount }).map((_, index) => (
                    <KanbanColumn
                        key={index}
                        id={`loading-${index}`}
                        title="Loading..."
                        count={itemCount}
                        onAddClick={() => { }}
                    >
                        {Array.from({ length: itemCount }).map((_, i) => (
                            <ProjectCardSkeleton key={i} />
                        ))}
                    </KanbanColumn>
                ))}
            </KanbanBoard>
        </KanbanBoardContainer>
    );
};
