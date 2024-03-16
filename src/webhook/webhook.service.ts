import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as crypto from 'crypto';

export enum GithubEvent {
  BranchProtectionConfiguration = 'branch_protection_configuration',
  BranchProtectionRule = 'branch_protection_rule',
  CheckRun = 'check_run',
  CheckSuite = 'check_suite',
  CodeScanningAlert = 'code_scanning_alert',
  CommitComment = 'commit_comment',
  Create = 'create',
  CustomProperty = 'custom_property',
  CustomPropertyValues = 'custom_property_values',
  Delete = 'delete',
  DependaBotAlert = 'dependabot_alert',
  Deployment = 'deployment',
  DeploymentProtectionRule = 'deployment_protection_rule',
  DeploymentReview = 'deployment_review',
  DeploymentStatus = 'deployment_status',
  Discussion = 'discussion',
  DiscussionComment = 'discussion_comment',
  Fork = 'fork',
  GithubAppAuthorization = 'github_app_authorization',
  Gollum = 'gollum',
  Installation = 'installation',
  InstallationRepositories = 'installation_repositories',
  InstallationTarget = 'installation_target',
  IssueComment = 'issue_comment',
  Issues = 'issues',
  Label = 'label',
  MarketplacePurchase = 'marketplace_purchase',
  Member = 'member',
  Membership = 'membership',
  MergeGroup = 'merge_group',
  Meta = 'meta',
  Milestone = 'milestone',
  OrgBlock = 'org_block',
  Organization = 'organization',
  Package = 'package',
  PageBuild = 'page_build',
  PersonnalAccessTokenRequest = 'personnal_access_token_request',
  Ping = 'ping',
  ProjectCard = 'project_card',
  Project = 'project',
  ProjectColumn = 'project_column',
  ProjectsV2 = 'projects_v2',
  ProjectsV2Item = 'projects_v2_item',
  Public = 'public',
  PullRequest = 'pull_request',
  PullRequestReviewComment = 'pull_request_review_comment',
  PullRequestReview = 'pull_request_review',
  PullRequestReviewThread = 'pull_request_review_thread',
  Push = 'push',
  RegistryPackage = 'registry_package',
  Release = 'release',
  RepositoryAdvisory = 'repository_advisory',
  Repository = 'repository',
  RepositoryDispatch = 'repository_dispatch',
  RepositoryImport = 'repository_import',
  RepositoryRuleset = 'repository_ruleset',
  RepositoryVulnerabilityAlert = 'repository_vulnerability_alert',
  SecretScanningAlert = 'secret_scanning_alert',
  SecretScanningAlertLocation = 'secret_scanning_alert_location',
  SecurityAdvisory = 'security_advisory',
  SecurityAndAnalysis = 'security_and_analysis',
  Sponsorship = 'sponsorship',
  Star = 'star',
  Status = 'status',
  TeamAdd = 'team_add',
  Team = 'team',
  Watch = 'watch',
  WorkflowDispatch = 'workflow_dispatch',
  WorkflowJob = 'workflow_job',
  WorkflowRun = 'workflow_run',
}

@Injectable()
export class WebhookService {
  async verifyWebhookSignature(req: FastifyRequest, secret: string) {
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    const trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    const untrusted = Buffer.from(
      req.headers['x-hub-signature-256'] as string,
      'ascii',
    );
    return crypto.timingSafeEqual(trusted, untrusted);
  }
}
