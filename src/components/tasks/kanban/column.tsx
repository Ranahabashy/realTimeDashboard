/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unexpected-multiline */
import { Text } from "@/components/text"
import { PlusOutlined } from "@ant-design/icons"
import { useDroppable, UseDroppableArguments } from "@dnd-kit/core"
import { Badge, Button, Space } from "antd"

type Props = {
  id: string;
  title:string;
  description?: React.ReactNode;
  count:number;
  data?: UseDroppableArguments['data'];
onAddClick?: (args:{id: string}) => void ;
}
export const KanbanColumn = ({
children,
id,
title,
description,
count,
data,
onAddClick
}:React.PropsWithChildren<Props>) => {
    const { isOver, setNodeRef, active } = useDroppable({id ,data})

  const onAddClickHansler = () => { 
    onAddClick?.({id})
}
    

return (
        <div
            ref={setNodeRef}
            style={{ display: 'flex', flexDirection: 'column', padding: '0 16px' }}
        >
            <div
                style={{ padding: '12px' }}
            >
                <Space
                    style={{ width: '100%', justifyContent: 'space-between' }}

                >
                    <Text ellipsis={{ tooltip: 'title' }}
                        size="xs"
                        strong
                        style={{ textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                    >
                        {title}
                    </Text >
                    {!!count && <Badge count={count} />}
                    <Button shape="circle"
                        icon={<PlusOutlined />}
                        onClick={onAddClickHansler}
                        
                    />

                </Space>
                {description}
            </div>
          
            <div
                style={{ flex: 1, overflowY: active? 'unset' :'auto', border: '2px dashed transparent', borderColor:isOver? '#000040' : 'transparent' , marginTop:'12px'
 }}

            >
  <div
                style={{display: 'flex', flexDirection: 'column', borderRadius:'4px' , gap:'8px'
 }}

            >

{children}
            </div>


            </div>
        </div>
    )
}

