```
  not ready, in progress...
  todo: add @svgr/webpack
  https://blog.bitsrc.io/transform-an-svg-into-a-react-component-with-svgr-8d2ba10f424c

  Instead you can just use:
  import { ReactComponent as MessageIcon } from './icons/Message.svg';
  <MessageIcon />

  Warning: Invalid DOM property `stroke-width`. Did you mean `strokeWidth`?
```

# Usage

## With chaining
<Icon['FILE_NAME_WITHOUT_EXTENSION'] />

### Example
<Icon.Message />

## With children
<LogosIcon>FILE_NAME_WITHOUT_EXTENSION</LogosIcon>

### Example
<LogosIcon>Message</LogosIcon>

## Or with prop
<LogosIcon name="FILE_NAME_WITHOUT_EXTENSION" />

### Example
<LogosIcon name="Message" />
