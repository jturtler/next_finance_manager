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
} from 'recharts';
import * as ReportService from "@/lib/services/reportService";
import * as Utils from "@/lib/utils";

// // Sample aggregated data
// const data = [
//   {
//     "totalExpense": 12573,
//     "year": 2023,
//     "categories": [
//         {
//             "category": "Miscellaneous",
//             "totalAmount": 180,
//             "transactions": [
//                 {
//                     "date": "2023-06-24T02:56:47.719Z",
//                     "amount": 30,
//                     "description": "Dish washing, detergent, soaps, ...."
//                 },
//                ...
//                
//             ]
//         },
//         ...
//     ]
// },
//     ...
// ];

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
	console.log(payload);
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
			>{`${payload.name} ${value}`}</text>
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
	// pieActiveIndex : [
	//   {2023: 0},
	//   {2024: 1}
	// ]
	const initPieActiveIndex = (): JSONObject => {
		let indexJson = {};
		for (let i = 0; i < data.length; i++) {
			const year = data[i].year;
			indexJson[year] = 0;
		}

		return indexJson;
	}
	const [pieActiveIndex, setPieActiveIndex] = useState<JSONObject>(initPieActiveIndex());


	const setToolTip = (year, index) => {
		const pieActiveIndexTemp = Utils.cloneJSONObject(pieActiveIndex);
		pieActiveIndexTemp[year] = index;
		setPieActiveIndex(pieActiveIndexTemp);
	}
	const transformData = (reportData: JSONObject): JSONObject[] => {
		return reportData.categories.map((entry) => ({
			name: entry.category,
			value: entry.totalAmount,
			year: reportData.year,
		}));
	};

	return (
		<>
			{data !== undefined && data.map((reportData, index) => {
				const year = reportData.year;
				const transformedData = transformData(reportData);
				return (
					<ResponsiveContainer key={`peChart_${year}_${index}`} width="100%" height={400}>
						<PieChart>
							<Pie
								activeIndex={pieActiveIndex[year]}
								activeShape={renderActiveShape}
								data={transformedData}
								cx="50%"
								cy="50%"
								innerRadius={70}
								outerRadius={100}
								fill={ReportService.expenseColors[index % ReportService.expenseColors.length]}
								dataKey="value"
								onMouseEnter={(_, idx) => setToolTip(year, idx)}
							>
								{transformedData.map((item, idx) =>
									<Cell key={`cell-outer-${idx}`} fill={ReportService.expenseColors[idx % ReportService.expenseColors.length]} />
								)}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				)
			})}
		</>
	);
}

