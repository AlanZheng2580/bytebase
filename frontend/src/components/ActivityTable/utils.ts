import { getIssueId } from "@/store/modules/v1/common";
import type {
  ActivityIssueCreatePayload,
  ActivityProjectDatabaseTransferPayload,
} from "@/types";
import { UNKNOWN_ID, EMPTY_ID } from "@/types";
import type { LogEntity } from "@/types/proto/v1/logging_service";
import { LogEntity_Action } from "@/types/proto/v1/logging_service";
import type { Link } from "./types";

export const getLinkFromActivity = (activity: LogEntity): Link | undefined => {
  switch (activity.action) {
    case LogEntity_Action.ACTION_PROJECT_REPOSITORY_PUSH: {
      // TODO(d): use the link.
      return undefined;
    }
    case LogEntity_Action.ACTION_PROJECT_DATABASE_TRANSFER: {
      const payload = JSON.parse(
        activity.payload
      ) as ActivityProjectDatabaseTransferPayload;
      return {
        title: payload.databaseName,
        path: `/db/${payload.databaseId}`,
        external: false,
      };
    }
    case LogEntity_Action.ACTION_PIPELINE_TASK_STATUS_UPDATE:
    case LogEntity_Action.ACTION_PIPELINE_STAGE_STATUS_UPDATE:
    case LogEntity_Action.ACTION_PIPELINE_TASK_RUN_STATUS_UPDATE:
    case LogEntity_Action.ACTION_PIPELINE_TASK_PRIOR_BACKUP:
    case LogEntity_Action.ACTION_ISSUE_STATUS_UPDATE:
    case LogEntity_Action.ACTION_ISSUE_CREATE: {
      const payload = JSON.parse(
        activity.payload
      ) as ActivityIssueCreatePayload;

      const issueId = getIssueId(activity.resource);
      if (issueId === UNKNOWN_ID || issueId === EMPTY_ID) {
        return undefined;
      }
      return {
        title: payload.issueName,
        path: `/${activity.resource}/issues/${issueId}`,
        external: false,
      };
    }
  }
  return undefined;
};
