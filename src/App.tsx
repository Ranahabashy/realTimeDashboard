import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { authProvider, dataProvider, liveProvider } from "./provider";
import routerBindings, {
  DocumentTitleHandler,
  CatchAllNavigate,
  UnsavedChangesNotifier
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Layout from "./components/layout";
import { Home, ForgotPassword, Register, CompanyList, CompanyForm, AuthPage } from "./pages"
import { resources } from "./config/resources";
import Create from "./pages/Company/create";
import { CompanyContactsTable } from "./pages/Company/cotacts-table";
import List from "./pages/tasks/List";
import TasksCreatePage from "./pages/tasks/task-create-page";
import TasksEditPage from "./pages/tasks/edit";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "g95vCK-2XMuJi-kNcJG3",
                liveMode: "auto",
              }}
            >
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/forgot-passward" element={<ForgotPassword />} />

              </Routes>
              <Routes>
                <Route

                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="/companies" >
                    <Route index element={<CompanyList />} />
                    <Route path="new" element={<Create />} />
                    <Route path="contacts" element={<CompanyContactsTable />} />
                    <Route path="edit/:id" element={<CompanyForm />} />
                  </Route>
                  <Route path="/tasks" element={
                    < List>
                      <Outlet />

                    </List>

                  }>
                    <Route path="new" element={<TasksCreatePage />} />
                    <Route path="edit" element={<TasksEditPage />} />


                  </Route>

                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter >
  );
}

export default App;
