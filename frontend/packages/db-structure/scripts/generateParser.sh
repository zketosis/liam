#!/bin/bash

# Use `npx` to invoke `peggy` from the `node_modules` directory
exec npx peggy \
  --format es \
  --dependencies \
  '{
    "pluralize": "pluralize-esm",
    "{ isEqual }": "lodash-es",
    "{ sortBy }": "lodash-es"
  }' \
  ./src/parser/schemarb/parser.pegjs
