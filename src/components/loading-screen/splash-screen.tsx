
import Box, { BoxProps } from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
// ----------------------------------------------------------------------
export default function SplashScreen({ sx, ...other }: BoxProps) {
  return (
    // <Box
    //   sx={{
    //     right: 0,
    //     width: '100%',
    //     bottom: 0,
    //     height: '100%',
    //     minHeight: '125px',
    //     minwidth: '125px',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     ...sx,
    //   }}
    //   {...other}
    // >
    //   <>
    //     <m.div
    //       animate={{
    //         scale: [1, 0.9, 0.9, 1, 1],
    //         opacity: [1, 0.48, 0.48, 1, 1],
    //       }}
    //       transition={{
    //         duration: 2,
    //         ease: 'easeInOut',
    //         repeatDelay: 1,
    //         repeat: Infinity,
    //       }}
    //     >
    //       <Logo isLoader />
    //     </m.div>
    //     <Box
    //       component={m.div}
    //       animate={{
    //         scale: [1.6, 1, 1, 1.6, 1.6],
    //         rotate: [270, 0, 0, 270, 270],
    //         opacity: [0.25, 1, 1, 1, 0.25],
    //         borderRadius: ['25%', '25%', '50%', '50%', '25%'],
    //       }}
    //       transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
    //       sx={{
    //         width: 100,
    //         height: 100,
    //         position: 'absolute',
    //         border: `solid 3px #212B36`,
    //       }}
    //     />
    //     <Box
    //       component={m.div}
    //       animate={{
    //         scale: [1, 1.2, 1.2, 1, 1],
    //         rotate: [0, 270, 270, 0, 0],
    //         opacity: [1, 0.25, 0.25, 0.25, 1],
    //         borderRadius: ['25%', '25%', '50%', '50%', '25%'],
    //       }}
    //       transition={{
    //         ease: 'linear',
    //         duration: 3.2,
    //         repeat: Infinity,
    //       }}
    //       sx={{
    //         width: 120,
    //         height: 120,
    //         position: 'absolute',
    //         border: `solid 8px #B3BAC1`,
    //       }}
    //     />
    //   </>
    // </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress size="3rem" />
    </Box>
  );
}
