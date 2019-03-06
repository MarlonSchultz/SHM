import { Project } from 'actions/projects';
import React, { Component } from 'react';
import { withRouter, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import ProjectInput from '../ProjectInput/ProjectInput';
import StakeholderInput from 'components/Stakeholder/StakeholderInput/StakeholderInput';
import { addStakeholder, DraftStakeholder } from 'actions/stakeholder';
import { FormikActions } from 'formik';

interface Props extends RouteComponentProps {
    project?: Project;
    onUpdate: (id: number, name: string, description?: string) => void;

}

class ProjectView extends Component<Props> {

    public updateProject = (name: string, description?: string) => {
        if (this.props.project && this.props.project.id) {
            this.props.onUpdate(this.props.project.id, name, description);
        }
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
                                onSubmit={(values: DraftStakeholder, actions: FormikActions<DraftStakeholder>) => {
                                    addStakeholder(values).then((result: boolean) => {
                                        if (result) {
                                            actions.resetForm({
                                                projectId: project.id!,
                                                name:'',
                                                company: '',
                                                attitude: '',
                                                role: '',
                                            });
                                        }
                                    });
                                }}
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
