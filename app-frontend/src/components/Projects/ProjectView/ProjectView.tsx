import { Project } from 'actions/projects';
import { addStakeholder, DraftStakeholder } from 'actions/stakeholder';
import StakeholderInput from 'components/Stakeholder/StakeholderInput/StakeholderInput';
import { FormikActions } from 'formik';
import React, { Component } from 'react';
import { withRouter, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import ProjectInput from '../ProjectInput/ProjectInput';

interface Props extends RouteComponentProps {
    project?: Project;
    onUpdate: (project: Project) => void;

}

class ProjectView extends Component<Props> {

    public updateProject = (name: string, description?: string) => {
        if (this.props.project && this.props.project.id) {
            this.props.onUpdate({
                id: this.props.project.id,
                name,
                description,
            });
        }
    }

    public createStakeholder = (project: Project) =>
        (values: DraftStakeholder, actions: FormikActions<DraftStakeholder>): void => {
            addStakeholder(values).then((result: boolean) => {
                if (result) {
                    actions.resetForm({
                        projectId: project.id,
                        name: '',
                        company: '',
                        attitude: '',
                        role: '',
                    });
                }
            });
        }

    public render(): JSX.Element {
        const { match, project } = this.props;
        if (!project) {
            return (<div>No data</div>);
        }

        return (
            <Switch>
                <Route
                    path={`${match.path}`}
                    exact={true}
                    render={() => (
                        <div>
                            <h1>#{project.id} {project.name} <Link to={`${match.url}/edit`}>🖋️</Link></h1>
                            <p>{project.description}</p>
                            <StakeholderInput
                                project={project}
                                onSubmit={this.createStakeholder(project)}
                            />
                        </div>
                    )}
                />
                <Route
                    path={`${match.path}/edit`}
                    render={() => (
                        <div>
                            <Link to={`${match.url}`}>Back</Link>
                            <ProjectInput
                                name={this.props.project ? this.props.project.name : ''}
                                description={this.props.project ? this.props.project.description : ''}
                                buttonLabel={'Update'}
                                onSave={this.updateProject}
                            />
                        </div>
                    )}
                />
            </Switch>
        );
    }
}

export default withRouter(ProjectView);
