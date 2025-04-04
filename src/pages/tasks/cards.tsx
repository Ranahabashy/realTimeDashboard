/* eslint-disable @typescript-eslint/no-empty-function */
import { Text } from '@/components/text';
import { User } from '@/graphql/schema.types';
import {
    ClockCircleOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import {
    Button,
    Card,
    ConfigProvider,
    Dropdown,
    MenuProps,
    Space,
    Tag,
    Tooltip,
    theme,
} from 'antd';
import React, { memo, useMemo } from 'react';
import { TextIcon } from './text-icon';
import dayjs from 'dayjs';
import { getDateColor } from '@/utilities';
import CustomAvatar from '@/components/custom-avatar';
import { useDelete, useNavigation } from '@refinedev/core';

type ProjectCardProps = {
    id: string;
    title: string;
    dueDate?: string;
    users?: {
        id: string;
        name: string;
        avatarUrl?: User['avatarUrl'];
    }[];
    updatedAt?: string;
};

const ProdjectCard = ({ id, title, dueDate, users }: ProjectCardProps) => {
    const { token } = theme.useToken();
    const { edit } = useNavigation();
    const { mutate } = useDelete();

    const dropdownItems = useMemo<MenuProps['items']>(
        () => [
            {
                label: 'View card',
                key: '1',
                icon: <EyeOutlined />,
                onClick: () => {
                    edit('task', id, 'replace');
                },
            },
            {
                danger: true,
                label: 'Delete card',
                key: '2',
                icon: <DeleteOutlined />,
                onClick: () => {
                    mutate({
                        resource: 'tasks',
                        id,
                        meta: {
                            Operation: 'task',
                        },
                    });
                },
            },
        ],
        [edit, id, mutate],
    );

    const dueDateOptions = useMemo(() => {
        if (!dueDate) return null;
        const date = dayjs(dueDate);
        return {
            Color: getDateColor({ date: dueDate }) as string,
            text: date.format('MMM DD'),
        };
    }, [dueDate]);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Tag: {
                        colorText: token.colorTextSecondary,
                    },
                    Card: {
                        headerBg: 'transparent',
                    },
                },
            }}
        >
            <Card
                size="small"
                onClick={() => edit("task", id, "replace")}
                title={
                    <Text ellipsis={{ tooltip: title }}>
                        {title}
                    </Text>
                }
                extra={
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: dropdownItems,
                            onPointerDown: (e) => e.stopPropagation(),
                            onClick: (e) => e.domEvent.stopPropagation(),
                        }}
                        placement="bottom"
                        arrow={{ pointAtCenter: true }}
                    >
                        <Button
                            type="text"
                            shape="round"
                            icon={<MoreOutlined style={{ transform: 'rotate(90deg)' }} />}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Dropdown>
                }
            />

        </ConfigProvider>
    );
};

export default ProdjectCard;

export const ProdjectCardMemo = memo(ProdjectCard, (prev, next) => {
    return (
        prev.id === next.id &&
        prev.title === next.title &&
        prev.dueDate === next.dueDate &&
        prev.users?.length === next.users?.length &&
        prev.updatedAt === next.updatedAt
    );
});
