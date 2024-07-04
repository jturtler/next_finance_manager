import { JSONObject } from '@/lib/definations';
import React, { useCallback, useState } from 'react';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
	Sector
} from 'recharts';
import * as ReportService from "@/lib/services/reportService";
import * as Utils from "@/lib/utils";


const data1 = [
	{ name: "Group A", value: 400 },
	{ name: "Group B", value: 300 },
	{ name: "Group C", value: 300 },
	{ name: "Group D", value: 200 },
  ];
  

export default function IncomeVsExpensePieChart({ data }) {
	  
	const transformData = (details: JSONObject): JSONObject[] => {
		return Object.keys(details).map((categoryName) => ({
			name: categoryName,
			value: details[categoryName]
		}));
	};

	return (
		<>
		{/* <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data1}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          // labelLine={false}
          // label={false}'
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        />
        <Cell fill="#00dd00" />

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 20, fontWeight: "bold", fill: "#333" }}
        >
          Center Text
        </text>
      </PieChart>
    </ResponsiveContainer> */}

			{data.map((reportData, rIdx) => {
				const dataKey = `${reportData.date.year}-${reportData.date.quarter}-${reportData.date.month}` ;
				return (
					<React.Fragment key={rIdx}>
						{(reportData.expense === undefined ) ? "" : (
							
						<ResponsiveContainer key={`peChart_${dataKey}_${rIdx}`} width="100%" height={400}>
							<PieChart>
								<Pie
									data={transformData(reportData.expense)}
									 
									dataKey="value"
          nameKey="name"
									cx="50%"
          cy="50%"
									// innerRadius={60}
									// outerRadius={100}
									// fill={ReportService.expenseColors[rIdx % ReportService.expenseColors.length]}
								
									innerRadius={60}
									outerRadius={100}
									// fill="#8884d8"
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
								>
									{transformData(reportData.expense).map((item: JSONObject, idx) =>
										<Cell key={`cell-outer-${idx}`} fill={ReportService.expenseColors[idx % ReportService.expenseColors.length]} />
									)}


								</Pie>

								<text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 14, fontWeight: "bold", fill: "#333" }}
        >
         {dataKey}
        </text>
								<Tooltip />
							</PieChart>



						</ResponsiveContainer>
			)}

						{(reportData.income === undefined ) ? "" : (
						<ResponsiveContainer key={`income_${dataKey}_${rIdx}`} width="100%" height={400}>
							<PieChart>
								<Pie
									data={transformData(reportData.income)}
									 cx="50%"
          cy="50%"
									innerRadius={70}
									outerRadius={100}
									// fill={ReportService.incomeColors[rIdx % ReportService.incomeColors.length]}
									dataKey="value"
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
								>
									{transformData(reportData.income).map((item: JSONObject, idx) =>
										<Cell key={`cell-outer-${idx}`} fill={ReportService.incomeColors[idx % ReportService.incomeColors.length]} />
									)}
								</Pie>
								<text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 14, fontWeight: "bold", fill: "#333" }}
        >
         {dataKey}
        </text>
								<Tooltip />
							</PieChart>


						</ResponsiveContainer>
						)}

					</React.Fragment>
				)
			})}
		</>
	);
}

