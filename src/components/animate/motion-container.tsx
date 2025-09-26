import { m, MotionProps } from 'framer-motion';

import Box, { BoxProps } from '@mui/material/Box';

import { varContainer } from './variants';

// ----------------------------------------------------------------------

type IProps = BoxProps & MotionProps;

export interface Props extends IProps {
  action?: boolean;
}

export default function MotionContainer({ action = false, children, ...other }: Props) {
  if (action) {
    return (
      <Box
        component={m.div}
        initial={false}
        animate="animate"
        variants={varContainer()}
        {...other}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
