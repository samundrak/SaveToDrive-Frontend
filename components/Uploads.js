import React from 'react';
import renderIf from 'render-if';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import { Card, Row, Col, Progress, Icon } from 'antd';

const completedTasks = (tasks) => tasks.filter((task) => task.progress.percentage >= 99);
const Uploads = ({ tasks }) => (
  <Card style={{ marginTop: '1rem' }}>
    <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
      <Col>
        <h3>Uploads</h3>
      </Col>
      <Col>
        <strong style={{ color: '#9B9B9B' }}>
          {completedTasks(tasks).length}/{tasks.length} Completed
        </strong>
      </Col>
    </Row>
    {renderIf(!tasks.length)(
      <Row style={{ marginBottom: '1rem' }}>
        <Card>No any task</Card>
      </Row>
    )}
    {tasks.map((task) => (
      <Row style={{ marginBottom: '1rem' }} key={task.uuid}>
        <Card>
          <Row>
            <Col span={23}>
              <strong
                style={{
                  width: '95%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}
                title={task.name}
              >
                <a href={task.url} target="_blank" rel="noopener">
                  {task.name} {`(${task.progress.percentage || 0}%)`}
                </a>
                {renderIf(task.completed)(<Icon type="check-circle" style={{ color: 'green' }} />)}
                {renderIf(task.completed === false)(<Icon type="close-circle" style={{ color: 'red' }} />)}
              </strong>
            </Col>
            {
              // <Col span={1} style={{ textAlign: 'right' }}>
              //   <Icon type="close" style={{ color: '#9B9B9B' }} />
              // </Col>
            }
          </Row>
          <Progress percent={task.progress.percentage || 0} showInfo={false} />
          <small title={`Uploaded ${task.progress.transferred} MB of ${task.size} to ${startCase(task.service)}`} style={{ color: '#9B9B9B' }}>
            {`Uploaded ${task.progress.transferred} MB of ${task.size} to ${startCase(task.service)}`}
          </small>
        </Card>
      </Row>
    ))}
  </Card>
);

Uploads.propTypes = {
  tasks: PropTypes.array.isRequired
};

export default Uploads;
