import React from 'react';
import PropTypes from 'prop-types';

import { Dimmer, Loader, Icon, Card, Feed } from 'semantic-ui-react';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import startCase from 'lodash/fp/startCase';
import renderIf from 'render-if';
import { Link } from 'react-router-dom';
import { getMappedIconWithMime } from '../../Utils';

const Activities = ({ items, loading }) => (
  <Card fluid>
    <Card.Content>
      <Card.Header>Recent Activitys</Card.Header>
    </Card.Content>
    <Card.Content>
      <Feed>
        {items.map((item) => (
          <Feed.Event key={item._id}>
            <Feed.Label image={`/images/clouds/${item.service}.png`} />
            <Feed.Content>
              <Feed.Date content={distanceInWordsToNow(item.end_at, { addSuffix: true })} />
              <Feed.Summary>
                File&nbsp;
                <Icon name={getMappedIconWithMime(item.meta.type)} size="small" />
                <b>
                  <a target="_blank" rel="noopener noreferrer" href={item.url}>
                    {item.meta.name}
                  </a>
                </b>{' '}
                has been {`${(item.status || '').toLowerCase()} `}
                on service {startCase(item.service)}
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        ))}
        {renderIf(!items.length)(<p>No any recent activities.</p>)}
        {renderIf(items.length)(
          <div>
            <Link to="/uploads">See All</Link>
          </div>
        )}
      </Feed>
    </Card.Content>
    <Dimmer active={loading} inverted>
      <Loader size="large">Loading</Loader>
    </Dimmer>
  </Card>
);

Activities.propTypes = {
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Activities;
