/* eslint-disable */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';

const Urls = ({ urls, handleChange, handleRemove }) => (
  <div>
    {urls.map((url) => (
      <Fragment key={url.id}>
        <Input
          onChange={handleChange(url.id)}
          placeholder="Enter url here"
          value={url.value}
          addonAfter={<Button onClick={handleRemove(url.id)} shape="circle" icon="delete" size="default" />}
        />
      </Fragment>
    ))}
  </div>
);
Urls.propTypes = {
  urls: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired
};
export default Urls;
// onClick={handleRemove(url.id)}
