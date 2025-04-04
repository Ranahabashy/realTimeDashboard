import React from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import {
  getDefaultFilter,
  type HttpError,
  useGo,
} from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Space, Table } from "antd";

import type { CompaniesListQuery } from "@/graphql/types";
import { currencyNumber } from "@/utilities";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";

type Company = GetFieldsFromList<CompaniesListQuery>;

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();

  const {
    tableProps,
    filters,
    setFilters, 
  } = useTable<Company, HttpError, Company>({
    resource: "companies",
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        headerButtons={() => (
          <CreateButton
            onClick={() =>
              go({
                to: {
                  resource: "companies",
                  action: "create",
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              })
            }
          />
        )}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            pageSizeOptions: ["12", "24", "48", "96"],
            showTotal: (total) => `Total: ${total} companies`

          }}
          rowKey="id"
        >
          <Table.Column<Company>
            dataIndex="name"
            title="Company title"
            defaultFilteredValue={getDefaultFilter("name", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input
                  allowClear
                  placeholder="Search Company"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters([
                      {
                        field: "name",
                        operator: "contains",
                        value,
                      },
                    ]);
                  }}
                />
              </FilterDropdown>
            )}
            render={(_, record) => (
              <Space>
                <CustomAvatar
                  shape="square"
                  name={record.name}
                  src={record.avatarUrl}
                />
                <Text
                  style={{ whiteSpace: "nowrap" }}>{record.name}</Text>
              </Space>
            )}
          />

          {/* 👇 Revenue Column */}
          <Table.Column<Company>
            dataIndex="totalRevenue"
            title="Open deals amount"
            render={(_, company) => (
              <Text>
                {currencyNumber(
                  company?.dealsAggregate?.[0].sum?.value || 0,
                )}
              </Text>
            )}
          />

          {/* 👇 Actions Column */}
          <Table.Column<Company>
            fixed="right"
            dataIndex="id"
            title="Actions"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </div>
  );
};
