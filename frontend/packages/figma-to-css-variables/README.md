# Figma to CSS Variables

## Overview

This script is designed to handle various tasks related to Figma local variables and Style Dictionary. It can fetch Figma local variables, transform them for Style Dictionary, and run Style Dictionary with specified options.

## Environment Variables

The script requires the following environment variables:

- `FIGMA_FILE_KEY`: The key of the Figma file.
- `FIGMA_ACCESS_TOKEN`: The token to access the Figma API.

## Command Line Arguments

The script accepts the following command line arguments:

- `--fetch`: Fetches Figma local variables.
- `--transform`: Transforms variables for Style Dictionary.
- `--generate`: Runs Style Dictionary with the specified output path.
- `--output <path>`: Specifies the output path for the generated files. Defaults to 'build/css'.
- `--filter-modes <modes>`: Specifies filter modes for Style Dictionary as a comma-separated list.

If no specific argument is provided, the script defaults to running all steps in sequence.

## Usage

To run the script, use the following command:

```sh
FIGMA_FILE_KEY=FnK... FIGMA_ACCESS_TOKEN=figd_xxx pnpm --filter @liam-hq/figma-to-css-variables sync --output '../../apps/service-site/src/styles' --filter-modes 'Dark,Mode 1'
```
