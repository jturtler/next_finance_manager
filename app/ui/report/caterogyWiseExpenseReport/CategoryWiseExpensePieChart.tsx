import { JSONObject } from '@/lib/definations';
import React, { useCallback, useState } from 'react';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
	Sector,
	XAxis,
} from 'recharts';
import * as ReportService from "@/lib/services/reportService";
import * as Utils from "@/lib/utils";


const renderActiveShape = (props: any) => {
	const RADIAN = Math.PI / 180;
	const {
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
		value
	} = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? "start" : "end";

	return (
		<g>
			<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
				{payload.payload.year}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path
				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
				stroke={fill}
				fill="none"
			/>
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				textAnchor={textAnchor}
				fill="#333"
			>{`${payload.category} ${value}`}</text>
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill="#999"
			>
				{`(Rate ${(percent * 100).toFixed(2)}%)`}
			</text>
		</g>
	);
};


export default function CategoryWiseExpensePieChart({ data }) {
	// const [activeIndex, setActiveIndex] = useState(0);
	// const onPieEnter = useCallback(
	// 	(_, index) => {
	// 	setActiveIndex(index);
	// 	},
	// 	[setActiveIndex]
	// );

	const renderCustomLabel = ({ category, value }) => {
		return `${category}: ${value.toFixed(2)} $`;
	};
		
	const transformData = (dataList: JSONObject): JSONObject[] => {
		let resultList: JSONObject[] = [];

		for( let i=0; i<dataList.length; i++ ) {
			const expenseDataList = dataList[i].expense;

			if( expenseDataList != undefined ) {
				for( let categoryName in expenseDataList ) {
					const expenseVal = expenseDataList[categoryName];
					const found = Utils.findItemFromList(resultList, categoryName, "category");
					if( found ) {
						found.totalAmount += expenseVal;
					}
					else {
						resultList.push({ category: categoryName, totalAmount: expenseVal });
					}
				}
			}
		}

		return resultList;
		// return reportData.categories.map((entry) => ({
		// 	name: entry.category,
		// 	value: entry.totalAmount,
		// 	year: reportData.year,
		// }));
	};

	const transformedData = transformData(data);
	console.log(transformedData);
	return (
		<>
			<ResponsiveContainer width="100%" height={400}>
				<PieChart>
					<Pie
						// activeIndex={activeIndex}
						// activeShape={renderActiveShape}
						data={transformedData}
						cx="50%"
						cy="50%"
						innerRadius={70}
						outerRadius={100}
						dataKey="totalAmount"
						labelLine={true}
        				label={renderCustomLabel}
						// onMouseEnter={onPieEnter}
					>
						{transformedData.map((item, idx) =>
							<Cell key={`cell-outer-${idx}`} fill={ReportService.expenseColors[idx % ReportService.expenseColors.length]} />
						)}
					</Pie>

				</PieChart>
			</ResponsiveContainer>
		</>
	);
}

