import * as React from "react"

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>((props, ref) => (
  <hr ref={ref} {...props} />
))
Separator.displayName = "Separator"

export { Separator }
