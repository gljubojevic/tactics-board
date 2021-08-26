import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

/**
 * Private module reserved for @material-ui packages.
 */
export default function createSvgIcon(path, displayName,dimensions) {
  const Component = (props, ref) => (
    <SvgIcon data-testid={`${displayName}Icon`} ref={ref} {...props} viewBox={`0 -25 ${dimensions.width} ${dimensions.height}`}>
      {path}
    </SvgIcon>
  );

  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = `${displayName}Icon`;
  }

  Component.muiName = SvgIcon.muiName;

  return React.memo(React.forwardRef(Component));
}