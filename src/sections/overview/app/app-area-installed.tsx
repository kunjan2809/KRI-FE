import { ApexOptions } from 'apexcharts';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import ButtonBase from '@mui/material/ButtonBase';
import Card, { CardProps } from '@mui/material/Card';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { useGetDashboardAnalyticsYearlyOrders } from 'src/api/analytics';

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  options?: ApexOptions;
}

export default function AppAreaInstalled({ title, subheader, options, ...other }: Props) {
  const theme = useTheme();
  const { user } = useAuthContext();
  const popover = usePopover();

  // Generate available years (2022 to current year)
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: currentYear - 2021 }, (_, i) => (2022 + i).toString());

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [everagePercentage, setEveragePercentage] = useState(0);

  // Fetch data for selected year
  const { yearlyOrders, yearlyOrdersLoading, yearlyOrdersError } = useGetDashboardAnalyticsYearlyOrders(
    user?.accessToken as string,
    selectedYear
  );

  // Transform API data to chart format
  const chartData = useMemo(() => {
    if (!yearlyOrders?.monthly_data) return null;


    const categories = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const targetYearData = yearlyOrders.monthly_data.map((item: any) => item.target_year_count);
    const previousYearData = yearlyOrders.monthly_data.map((item: any) => item.previous_year_count);

    const totalTargetYearData = targetYearData.reduce((acc: number, curr: number) => acc + curr, 0);
    const totalPreviousYearData = previousYearData.reduce((acc: number, curr: number) => acc + curr, 0);
    // Calculate percentage change
    const calculatePercentage = totalPreviousYearData === 0 ? 0 : ((totalTargetYearData - totalPreviousYearData) / totalPreviousYearData) * 100;
    setEveragePercentage(calculatePercentage);

    return {
      categories,
      series: [
        {
          name: yearlyOrders.target_year.toString(),
          data: targetYearData,
        },
        {
          name: yearlyOrders.previous_year.toString(),
          data: previousYearData,
        },
      ],
    };
  }, [yearlyOrders]);

  const colors = [
    [theme.palette.primary.light, theme.palette.primary.main],
    [theme.palette.warning.light, theme.palette.warning.main],
  ];

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0], opacity: 1 },
          { offset: 100, color: colr[1], opacity: 1 },
        ]),
      },
    },
    xaxis: {
      categories: chartData?.categories || [],
    },
    ...options,
  });

  const handleChangeYear = useCallback(
    (newYear: string) => {
      popover.onClose();
      setSelectedYear(newYear);
    },
    [popover]
  );

  if (yearlyOrdersLoading) {
    return (
      <Card {...other}>
        <CardHeader title={title} subheader={`(${everagePercentage.toFixed(2)}%) than last year`} />
        <Box sx={{ height: 364, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </Box>
      </Card>
    );
  }

  if (yearlyOrdersError || !chartData) {
    return (
      <Card {...other}>
        <CardHeader title={title} subheader={`(${everagePercentage.toFixed(2)}%) than last year`} />
        <Box sx={{ height: 364, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Error loading data
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={`(${everagePercentage.toFixed(2)}%) than last year`}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
              }}
            >
              {selectedYear}

              <Iconify
                width={16}
                icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        <Box sx={{ mt: 3, mx: 3 }}>
          <Chart
            dir="ltr"
            type="line"
            series={chartData.series}
            options={chartOptions}
            width="100%"
            height={364}
          />
        </Box>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {availableYears.map((year) => (
          <MenuItem
            key={year}
            selected={year === selectedYear}
            onClick={() => handleChangeYear(year)}
          >
            {year}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
