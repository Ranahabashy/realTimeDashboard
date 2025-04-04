/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Input, Modal, Select } from "antd"
import { CompanyList } from "./list"
import { useModalForm, useSelect } from "@refinedev/antd"
import { useGo } from "@refinedev/core"
import { CREATE_COMPANY_MUTATION } from "@/graphql/mautations"
import { USERS_SELECT_QUERY } from "@/graphql/queries"
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar"


const Create = () => {
    const go = useGo()
    const goToListPage = () => {
        go({
            to: { resource: 'companies', action: 'list' },
            options: { keepQuery: true },
            type: 'replace'
        })
    }
    const { formProps, modalProps } = useModalForm({
        action: 'create',
        resource: 'companies',
        defaultVisible: true,
        redirect: false,
        mutationMode: 'pessimistic',
        onMutationSuccess: goToListPage,
        meta: {
            gqlMutation: CREATE_COMPANY_MUTATION
        }
    })
    const { selectProps, queryResult } = useSelect({
        resource: 'users',
        optionLabel: 'name',
        meta: {
            gqlQuery: USERS_SELECT_QUERY
        }
    })

    return (
        <>
            <CompanyList>
                <Modal
                    {...modalProps}
                    mask={true}
                    onCancel={goToListPage}
                    title='create company'
                    width={512}
                >
                    <Form {...formProps}
                        layout="vertical"
                    >
                        <Form.Item
                            label='company name'
                            name='name'
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="please enter your company name " />

                        </Form.Item>
                        <Form.Item
                            label='sales owner'
                            name='salesOwnerId'
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="please select sales owner"
                                {...selectProps}
                                options={
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    (selectProps.options ?? []).map((option: any) => ({
                                        value: option.value,
                                        label: (
                                            <SelectOptionWithAvatar
                                            name={option.label}
                                            avatarUrl={option.avatarUrl ?? undefined}
                                            shape="square"
                                          />
                                        ),
                                    }))
                                }
                            />


                        </Form.Item>
                    </Form>
                </Modal>

            </CompanyList>
        </>
    )
}

export default Create
