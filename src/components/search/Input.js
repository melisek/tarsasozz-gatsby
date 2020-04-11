import React from 'react'
import { connectSearchBox } from 'react-instantsearch-dom'

import { SearchIcon, Form, Input } from './styles'

export default connectSearchBox(({ refine, ...rest }) => (
  <Form>
    <Input
      type="text"
      placeholder="Keresés"
      aria-label="Keresés"
      onChange={e => refine(e.target.value)}
      {...rest}
    />
    <SearchIcon />
  </Form>
))