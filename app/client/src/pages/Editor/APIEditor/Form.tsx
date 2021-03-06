import React from "react";
import { connect } from "react-redux";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import {
  HTTP_METHOD_OPTIONS,
  HTTP_METHODS,
} from "constants/ApiEditorConstants";
import styled from "styled-components";
import FormLabel from "components/editorComponents/FormLabel";
import FormRow from "components/editorComponents/FormRow";
import { BaseButton } from "components/designSystems/blueprint/ButtonComponent";
import { PaginationField } from "api/ActionAPI";
import DropdownField from "components/editorComponents/form/fields/DropdownField";
import { API_EDITOR_FORM_NAME } from "constants/forms";
import { BaseTabbedView } from "components/designSystems/appsmith/TabbedView";
import Pagination from "./Pagination";
import { PaginationType, Action } from "entities/Action";
import { Icon } from "@blueprintjs/core";
import { HelpMap, HelpBaseURL } from "constants/HelpConstants";
import CollapsibleHelp from "components/designSystems/appsmith/help/CollapsibleHelp";
import KeyValueFieldArray from "components/editorComponents/form/fields/KeyValueFieldArray";
import PostBodyData from "./PostBodyData";
import ApiResponseView from "components/editorComponents/ApiResponseView";
import EmbeddedDatasourcePathField from "components/editorComponents/form/fields/EmbeddedDatasourcePathField";
import { AppState } from "reducers";
import { getApiName } from "selectors/formSelectors";
import ActionNameEditor from "components/editorComponents/ActionNameEditor";
import ActionSettings from "pages/Editor/ActionSettings";
import { apiActionSettingsConfig } from "mockResponses/ActionSettings";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${(props) => props.theme.headerHeight});
  overflow: auto;
  width: 100%;
  ${FormLabel} {
    padding: ${(props) => props.theme.spaces[3]}px;
  }
  ${FormRow} {
    padding: ${(props) => props.theme.spaces[2]}px;
    & > * {
      margin-right: 10px;
    }
    ${FormLabel} {
      padding: 0;
      width: 100%;
    }
  }
`;

const MainConfiguration = styled.div`
  padding-top: 10px;
  padding-left: 17px;
`;

const ActionButtons = styled.div`
  flex: 0 1 150px;
  justify-self: flex-end;
  display: flex;
  flex-direction: row;
`;

const ActionButton = styled(BaseButton)`
  &&& {
    max-width: 72px;
    &:last-of-type {
      margin-left: 16px;
    }
    min-height: 32px;
  }
`;

const DatasourceWrapper = styled.div`
  width: 100%;
`;

const SecondaryWrapper = styled.div`
  display: flex;
  height: calc(100% - 120px);
  border-top: 1px solid #d0d7dd;
  margin-top: 15px;
`;

const TabbedViewContainer = styled.div`
  flex: 1;
  padding-top: 12px;
  &&& {
    ul.react-tabs__tab-list {
      padding-left: 23px;
    }
  }
`;

export const BindingText = styled.span`
  color: ${(props) => props.theme.colors.bindingTextDark};
  font-weight: 700;
`;

const StyledOpenDocsIcon = styled(Icon)`
  svg {
    width: 12px;
    height: 18px;
  }
`;
const RequestParamsWrapper = styled.div`
  flex: 4;
  border-right: 1px solid #d0d7dd;
  height: 100%;
  overflow-y: auto;
  padding-top: 6px;
  padding-left: 17px;
  padding-right: 10px;
`;

const SettingsWrapper = styled.div`
  padding-left: 15px;
  ${FormLabel} {
    padding: 0px;
  }
`;

const HeadersSection = styled.div`
  margin-bottom: 32px;
`;

interface APIFormProps {
  pluginId: string;
  onRunClick: (paginationField?: PaginationField) => void;
  onDeleteClick: () => void;
  isRunning: boolean;
  isDeleting: boolean;
  paginationType: PaginationType;
  appName: string;
  httpMethodFromForm: string;
  actionConfigurationBody: Record<string, unknown> | string;
  actionConfigurationHeaders?: any;
  actionName: string;
  apiId: string;
  apiName: string;
}

type Props = APIFormProps & InjectedFormProps<Action, APIFormProps>;

export const NameWrapper = styled.div`
  width: 49%;
  display: flex;
  justify-content: space-between;
  input {
    margin: 0;
    box-sizing: border-box;
  }
`;

const ApiEditorForm: React.FC<Props> = (props: Props) => {
  const {
    pluginId,
    onDeleteClick,
    onRunClick,
    handleSubmit,
    isDeleting,
    isRunning,
    actionConfigurationHeaders,
    actionConfigurationBody,
    httpMethodFromForm,
    actionName,
  } = props;
  const allowPostBody =
    httpMethodFromForm && httpMethodFromForm !== HTTP_METHODS[0];

  return (
    <Form onSubmit={handleSubmit}>
      <MainConfiguration>
        <FormRow>
          <NameWrapper className="t--nameOfApi">
            <ActionNameEditor />
          </NameWrapper>
          <ActionButtons className="t--formActionButtons">
            <ActionButton
              text="Delete"
              accent="error"
              onClick={onDeleteClick}
              loading={isDeleting}
              className="t--apiFormDeleteBtn"
            />
            <ActionButton
              text="Run"
              accent="primary"
              filled
              onClick={() => {
                onRunClick();
              }}
              loading={isRunning}
              className="t--apiFormRunBtn"
            />
          </ActionButtons>
        </FormRow>
        <FormRow>
          <DropdownField
            placeholder="Method"
            name="actionConfiguration.httpMethod"
            className="t--apiFormHttpMethod"
            options={HTTP_METHOD_OPTIONS}
            isSearchable={false}
          />
          <DatasourceWrapper className="t--dataSourceField">
            <EmbeddedDatasourcePathField
              name="actionConfiguration.path"
              pluginId={pluginId}
              placeholder="https://mock-api.appsmith.com/users"
            />
          </DatasourceWrapper>
        </FormRow>
      </MainConfiguration>
      <SecondaryWrapper>
        <TabbedViewContainer>
          <BaseTabbedView
            tabs={[
              {
                key: "apiInput",
                title: "API Input",
                panelComponent: (
                  <RequestParamsWrapper>
                    <CollapsibleHelp>
                      <span>{`Having trouble taking inputs from widget?`}</span>
                      <a
                        href={`${HelpBaseURL}${HelpMap["API_BINDING"].path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" Learn How "}
                        <StyledOpenDocsIcon icon="document-open" />
                      </a>
                    </CollapsibleHelp>
                    <HeadersSection>
                      <KeyValueFieldArray
                        name="actionConfiguration.headers"
                        label="Headers"
                        actionConfig={actionConfigurationHeaders}
                        placeholder="Value"
                        dataTreePath={`${actionName}.config.headers`}
                      />
                    </HeadersSection>
                    <KeyValueFieldArray
                      name="actionConfiguration.queryParameters"
                      label="Params"
                      dataTreePath={`${actionName}.config.queryParameters`}
                    />
                    {allowPostBody && (
                      <PostBodyData
                        actionConfigurationHeaders={actionConfigurationHeaders}
                        actionConfiguration={actionConfigurationBody}
                        change={props.change}
                        dataTreePath={`${actionName}.config`}
                      />
                    )}
                  </RequestParamsWrapper>
                ),
              },
              {
                key: "pagination",
                title: "Pagination",
                panelComponent: (
                  <Pagination
                    onTestClick={props.onRunClick}
                    paginationType={props.paginationType}
                  />
                ),
              },
              {
                key: "settings",
                title: "Settings",
                panelComponent: (
                  <SettingsWrapper>
                    <ActionSettings
                      actionSettingsConfig={apiActionSettingsConfig}
                      formName={API_EDITOR_FORM_NAME}
                    />
                  </SettingsWrapper>
                ),
              },
            ]}
          />
        </TabbedViewContainer>

        <ApiResponseView />
      </SecondaryWrapper>
    </Form>
  );
};

const selector = formValueSelector(API_EDITOR_FORM_NAME);

export default connect((state: AppState) => {
  const httpMethodFromForm = selector(state, "actionConfiguration.httpMethod");
  const actionConfigurationBody = selector(state, "actionConfiguration.body");
  const actionConfigurationHeaders = selector(
    state,
    "actionConfiguration.headers",
  );
  const apiId = selector(state, "id");
  const actionName = getApiName(state, apiId) || "";

  return {
    actionName,
    apiId,
    httpMethodFromForm,
    actionConfigurationBody,
    actionConfigurationHeaders,
  };
})(
  reduxForm<Action, APIFormProps>({
    form: API_EDITOR_FORM_NAME,
  })(ApiEditorForm),
);
