import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dropdown, Icon, Input, Label, Form, Card, Grid } from 'semantic-ui-react';
import renderIf from 'render-if';
import toast from '../../Utils/Toast';
import Error from '../../components/Error';
import FilePreview from '../../components/FilePreview';
import FileLabel from '../../components/FileLabel';
import { getTags } from '../../api/guest';
import { popupOpener, getUniqKey } from '../../Utils';

class FileUploadContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      tags: [],
    };
  }

  handleTagToggle() {
    return () => {
      if (this.props.context.tags.length >= 3) {
        return toast('You can\'t add more then 3 tags', 'error');
      }

      if (this.props.context.isTag) {
        return this.props.actions.disableTags();
      }

      return this.props.actions.enableTags();
    };
  }

  handleRemoveService(service, index) {
    return () => {
      this.props.actions.removeService(service, index);
    };
  }

  services() {
    if (this.props.context.services.length) {
      return (
        <div className="sd-badges sd-border-bottom">
          <Label pointing="right">Cloud Services</Label>
          {this.props.context.services.map((service, index) => (
            <span className="badge badge-outline-info" key={getUniqKey()}>
              <svg className="icon icon--info">
                <use xlinkHref={`#${service.service}`} />
              </svg>
              {service.label}
              <button
                onClick={this.handleRemoveService(service, index)}
                type="button"
                className="close"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </span>
          ))}
        </div>
      );
    }
    return '';
  }

  handleConnectService(service) {
    return () => {
      popupOpener(service.service, service.url);
    };
  }

  handleRemoveTag() {
    return (tag, index) => () => {
      this.props.actions.removeTag(tag, index);
    };
  }

  handleTagChange() {
    return (event, { value }) => {
      const allowedTags = value.filter(item => !this.props.context.tags.includes(item));
      if (this.props.context.tags.length > 4) {
        return toast('You can\'t add more then 3 tags', 'error');
      }
      if (this.props.context.tags.length + 1 >= 3) {
        this.props.actions.disableTags();
      }
      return this.props.actions.addTag(allowedTags);
    };
  }

  handleTagSearch() {
    return (event, search = '') => {
      if (search.length < 3) {
        return false;
      }
      return getTags({ search: search.trim() })
        .then((response) => {
          this.setState(Object.assign({}, this.state, { tags: response.data }));
        })
        .catch(() => {
          this.setState(Object.assign({}, this.state, { tags: [] }));
        });
    };
  }

  handleUpdateFilename() {
    return (event) => {
      this.props.actions.updateErrors({ filename: [] });
      this.props.actions.updateFilename(event.target.value);
    };
  }

  handleEditFilename() {
    return () => {
      if (this.props.context.isFilename) {
        this.props.actions.updateFilename('');
        return this.props.actions.disableFilename();
      }

      return this.props.actions.enableFilename();
    };
  }

  handleUpdateEmail() {
    return (event) => {
      this.props.actions.updateErrors({ email: [] });
      this.props.actions.updateEmail(event.target.value);
    };
  }

  handleEditEmail() {
    return () => {
      if (this.props.context.isEmail) {
        this.props.actions.updateEmail(this.props.user.email);
        return this.props.actions.disableEmail();
      }

      return this.props.actions.enableEmail();
    };
  }

  handleUploadService(drive) {
    return () => {
      if (!drive.status) {
        return false;
      }
      const isServiceExist = this.props.context.services
        .some(service => service.service === drive.service);
      if (isServiceExist) {
        return toast(`${drive.label} has been already added.`, 'error');
      }

      return this.props.actions.addService(drive);
    };
  }

  handleUrl() {
    return (event) => {
      this.props.actions.updateErrors({ url: [] });
      this.props.actions.updateUrl(event.target.value);
    };
  }

  handleClosePreview() {
    return () => this.props.actions.onGetUrlMetaFailed();
  }

  renderFilenameInput() {
    if (this.props.context.isFilename) {
      return (
        <Form.Field>
          <Input
            type="text"
            fluid
            label="Filename"
            placeholder="Your desired filename"
            defaultValue={this.props.context.filename}
            onChange={this.handleUpdateFilename()}
          />
          <Error error={this.props.context.errors.filename} />
        </Form.Field>);
    }
    return '';
  }

  renderEmailInput() {
    if (this.props.context.isEmail) {
      return (
        <Form.Field>
          <Input
            type="text"
            fluid
            label="Email"
            placeholder="Your desired email"
            defaultValue={this.props.context.email}
            onChange={this.handleUpdateEmail()}
          />
          <Error error={this.props.context.errors.email} />
        </Form.Field>);
    }
    return '';
  }

  render() {
    return (
      <Form>
        <Card fluid>
          <Card.Content>
            <Form.Input
              width={16}
              type="text"
              aria-describedby="URL"
              value={this.props.context.url}
              placeholder="Enter/Paste URL here"
              onChange={this.handleUrl()}
              onBlur={this.props.handleUrlChange}
            />
            <Error error={this.props.context.errors.url} />
          </Card.Content>
          <Card.Content>
            {renderIf(this.props.context.meta.name)(<FilePreview
              meta={this.props.context.meta}
              handleClosePreview={this.handleClosePreview()}
            />)}
            {this.services()}
            <FileLabel
              options={this.state.tags}
              isTag={this.props.context.isTag}
              tags={this.props.context.tags}
              handleChange={this.handleTagChange()}
              handleRemoveTag={this.handleRemoveTag()}
              handleTagSearch={this.handleTagSearch()}
            />
            <Grid stackable>
              <Grid.Row columns="equal">
                <Grid.Column width={16}>
                  <Form.Field>
                    <Dropdown
                      button
                      fluid
                      text="Choose Cloud Services"
                      closeOnChange={false}
                    >
                      <Dropdown.Menu icon>
                        <Dropdown.Header content="Select Cloud" />
                        <Dropdown.Divider />
                        {this.props.drives.map(drive => (
                          <Dropdown.Item
                            onClick={this.handleUploadService(drive)}
                            key={drive.service}
                          >
                            <Icon
                              size="small"
                              name="circle"
                              color={drive.status ? 'green' : 'red'}
                              title={drive.status ? 'Connected' : 'Not Connected'}
                            />
                            <span className="text"> {drive.label} </span>
                            {!drive.status &&
                            <Icon
                              onClick={this.handleConnectService(drive)}
                              size="small"
                              circular
                              link
                              name="plug"
                              title="Connect to service"
                              className="right floated"
                            />
                            }
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Field>
                  {this.renderFilenameInput()}
                  {this.renderEmailInput()}
                </Grid.Column>
                <Grid.Column className="mt-2">
                  <Button
                    as="button"
                    circular
                    secondary={!!this.props.context.isEmail}
                    onClick={this.handleEditEmail()}
                    fluid
                  >
                    <Icon name="envelope" />
                    Email Me
                  </Button>
                </Grid.Column>
                <Grid.Column className="mt-2">
                  <Button
                    as="button"
                    circular
                    onClick={this.handleEditFilename()}
                    secondary={!!this.props.context.isFilename}
                    fluid
                  >
                    <Icon name="file" />
                    Edit file name
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <Card.Content extra>
            <Button
              primary
              size="small"
              onClick={this.props.handleUpload}
              floated="right"
            >Upload
            </Button>
          </Card.Content>
        </Card>
      </Form>
    );
  }
}

FileUploadContainer.propTypes = {
  context: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  drives: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  handleUpload: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired,
};
export default FileUploadContainer;
