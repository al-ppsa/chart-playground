import PieChart, {PieChartProps} from './PieChart';

export interface DonutChartProps<T> extends Omit<PieChartProps<T>, 'innerRadius'> {
    thickness: number;
}

export const DonutChart = <T,>(props: DonutChartProps<T>) => {
    const {outerRadius, thickness} = props;
    return (
        <PieChart
            {...props}
            innerRadius={outerRadius - (thickness || outerRadius)}

        />
    );
}

export default DonutChart;