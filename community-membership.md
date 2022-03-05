# Community membership

**Note:** This document is a work in progress

This doc outlines the various responsibilities of contributor roles in
Milvus.  The [Maintainers](https://github.com/milvus-io/milvus/blob/master/OWNERS_ALIASES) is in charge of membership maintenance and arbitrates divergence between members.

| Role | Responsibilities | Requirements | Defined by |
| -----| ---------------- | ------------ | -------|
| Contributor | Active contributor in the community | Finish at least one contribution to the project | Github all contributor list|
| Committer | Review contributions from other members | Finish at least one major contributions, History of reviews| [COMITTER](https://github.com/milvus-io/milvus/blob/master/COMMITTERS) |
| Maintainer | Contributions acceptance approval| Highly experienced active reviewer and contributor| [MAINTAINERS](https://github.com/milvus-io/milvus/blob/master/MAINTAINERS)|

## Roles and Responsibilities

### Contributors
Contributors are individuals who actively make contribution and are willing to participate in the code review of new contributions. They can have
issues and PRs assigned to them, participate in discussion through GitHub and slack, and pre-submit tests are automatically run for their PRs. 

**Defined by:** Github all contributor list

#### Requirements
- Have made at least one contribution to the project or community.  Contribution may include, but is not limited to:
    - Authoring or reviewing PRs on GitHub. At least one PR must be **merged**.
    - Filing or commenting on issues on GitHub
    - Contributing to community discussions (e.g. meetings, Slack, github discussion)
    - Improve docs
  
- Subscribed to the community [slack](milvusio.slack.com)
- Have read the [contributor guide](https://github.com/milvus-io/community/blob/master/CONTRIBUTING.md)
- Actively contributing to 1 or more milvus related repos.

#### Responsibilities and privileges

- Expected to be responsive to issues and PRs assigned to them
- Expected to follow community rules and values
- They can be assigned to issues and PRs, and people can ask contributors for reviews with a `/assign @username`.
- Tests can be run against their PRs automatically. 
- Ask for mentorship from Committers/Maintainers
- Join the community meetings and give their advice

### Committer
Committers are able to review code for quality and correctness on some part of the project. They are knowledgeable about both the codebase and software
engineering principles and they should practice the community core values and guidelines as an example.

**Defined by:** [COMITTER](https://github.com/milvus-io/milvus/blob/master/COMMITTERS)

#### Requirements

- contributor for at least 3 months
- Finish at least one major contribution to the community
- Reviewers for at least 5 PRs to the codebase
- Reviewed or merged at least 5 substantial PRs to the codebase
- Knowledgeable about the codebase/doc
- Nominated by at least 1 Maintainer, seconded by at least 3 other committers/maintainers.

#### Responsibilities and privileges
- Expected to be responsive to review pull requests
- Expected to assign issues and prs to related expertise
- Expected to be responsive to mentions of others on github and slack
- Expected to join the community meetings and activities in time
- Committer status may be a precondition to accepting large code contributions
- Mentor and guide new contributors
- Committers can do `/lgtm` on open PRs.
- Committers can vote for the new commiters
- Prioritized technical support from the community 

A committer is considered emeritus by their own declaration. An emeritus committer will be list on our hall of fame and may request reinstatement of review access from the maintainers, which will be sufficient to restore him or her to active committer status.

### Maintainer
Maintainers are able to both review and approve contributions. The maintainers consist group of active committers that moderate the discussion, manage the project release, and proposes new committers or maintainer. Maintainers should serve the community by upholding the community values and guidelines to make Milvus a better community for everyone.

**Defined by:** [MAINTAINER](https://github.com/milvus-io/milvus/blob/master/MAINTAINERS)

#### Requirements
- Commiter of the codebase for at least 3 months
- Merged at least 20 PRs to the codebase
- Primary reviewer for at least 10 substantial PRs to the codebase
- Deep understanding of the technical goals and design details of Milvus
- Nominated by at least 1 Approver, and reaches quorum in the exising Maintainer group.

#### Responsibilities and privileges
- Make and approve technical design decisions for the project.
- Define milestones and releases.
- Mentor and guide other memberships in the community.
- Ensure continued health of subproject
  - Adequate test coverage to confidently release
  - Tests are passing reliably (i.e. not flaky) and are fixed when they fail
- Ensure a healthy process for discussion and decision making is in place.
- Join the community meeting and discussion in time
- Nominate maintainers and committers and vote for new membership change.
- Prioritized technical support from the community 

maintainers has no concept of tenure, but will retire under the following circumstances:

Actively choose to retire due to personal reasons.

- When a maintainer can no longer participate in community affairs and become inactive in the last 6 months.
- If the maintainer absent on half of the community meetings and votings in the last 6 months.
- Retirees will become emeritus members and will be list at hall of fame.

