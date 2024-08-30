import { useEffect, useState, useTransition } from "react";
import api from "@/common/api";
import Loader from "../common/loader";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { CaseStage, formatCaseStage } from "@/constants";
import { ArrowUpIcon, BarChart2Icon, BarChart4Icon, CalendarCheckIcon, LineChartIcon, PieChartIcon, RefreshCcwIcon, UserIcon } from "lucide-react";
import { format, subMonths } from 'date-fns';
import { useTranslation } from "react-i18next";

interface Case {
  created_by_user: any;
  id: number;
  created_at: string;
  stage: string;
  insurer_details: {
    id: number;
    name: string;
  };
}

interface ApiResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: Case[];
  unique_insurers: { id: number; name: string }[];
  metadata: {
    pending_count: number;
    under_review_with_insurer_count: number;
    approved_count: number;
    rejected_count: number;
    under_insurer_enquiry_count: number;
    under_broker_enquiry_count: number;
  };
}

const ReportsComponent = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6m');
  const [refreshKey, setRefreshKey] = useState(0);

  const { t } = useTranslation()

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const endDate = new Date();
        const startDate = subMonths(endDate, parseInt(dateRange));
        const resp = await api.session.getSessions({ startDate, endDate });
        setCases(resp.data);
      } catch (error) {
        console.error("Error fetching cases data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [dateRange, refreshKey]);

  const stagesCount = cases.reduce(
    (acc, caseItem) => {
      acc[caseItem.stage] = (acc[caseItem.stage] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const insurersCount = cases.reduce(
    (acc, caseItem) => {
      const insurerName = caseItem.insurer_details.name;
      acc[insurerName] = (acc[insurerName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const casesOverTime = cases.reduce(
    (acc, caseItem) => {
      const date = new Date(caseItem.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const stagesData = Object.keys(stagesCount).map((stage) => ({
    name: formatCaseStage(stage),
    count: stagesCount[stage],
  }));

  const insurersData = Object.keys(insurersCount).map((insurer) => ({
    name: insurer,
    count: insurersCount[insurer],
  }));

  const casesOverTimeData = Object.keys(casesOverTime).map((date) => ({
    date,
    count: casesOverTime[date],
  }));

  const casesByAgentData = cases.reduce((acc, caseItem) => {
    const agentName = `${caseItem.created_by_user.first_name} ${caseItem.created_by_user.last_name}`;
    acc[agentName] = (acc[agentName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stagesOverTimeData = cases.reduce((acc, caseItem) => {
    const date = new Date(caseItem.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date };
      Object.values(CaseStage).forEach(stage => {
        acc[date][stage] = 0;
      });
    }
    acc[date][caseItem.stage]++;
    return acc;
  }, {} as Record<string, any>);

  const casesByAgentChartData = Object.keys(casesByAgentData).map(key => ({
    name: key,
    count: casesByAgentData[key],
  }));

  const stagesOverTimeChartData = Object.values(stagesOverTimeData);

  const casesByInsurerOverTimeData = cases.reduce((acc, caseItem) => {
    const date = new Date(caseItem.created_at).toLocaleDateString();
    const insurerName = caseItem.insurer_details.name;
    if (!acc[date]) {
      acc[date] = { date };
    }
    acc[date][insurerName] = (acc[date][insurerName] || 0) + 1;
    return acc;
  }, {} as Record<string, any>);

  const casesByInsurerOverTimeChartData = Object.keys(casesByInsurerOverTimeData).map(date => ({
    date,
    ...casesByInsurerOverTimeData[date],
  }));

  const casesByMonthData = cases.reduce((acc, caseItem) => {
    const date = new Date(caseItem.created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month < 10 ? '0' : ''}${month}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const casesByMonthChartData = Object.keys(casesByMonthData).map(key => ({
    date: key,
    count: casesByMonthData[key],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const ReportCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="py-5 sm:px-6 flex items-center justify-between border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );

  const DateRangeSelector = () => (
    <div className="flex items-center space-x-2 mb-4">
      <CalendarCheckIcon className="h-5 w-5 text-gray-400" />
      <select
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="1m">Last Month</option>
        <option value="3m">Last 3 Months</option>
        <option value="6m">Last 6 Months</option>
        <option value="12m">Last Year</option>
      </select>
    </div>
  );

  const SummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { title: "Total Cases", value: cases.length, icon: <BarChart4Icon className="h-6 w-6 text-blue-500" /> },
        { title: "Cases Rejected", value: cases.filter(c => {return (c.stage == CaseStage.REJECTED)}).length, icon: <BarChart4Icon className="h-6 w-6 text-green-500" /> },
        { title: "Approved Cases", value: cases.filter(c => c.stage === CaseStage.APPROVED).length, icon: <BarChart4Icon className="h-6 w-6 text-yellow-500" /> },
        { title: "Open Cases", value: cases.filter(c => {return (c.stage !== CaseStage.REJECTED && c.stage !== CaseStage.APPROVED)}).length, icon: <BarChart4Icon className="h-6 w-6 text-green-500" /> },
      ].map((item, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-5 py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.title}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{item.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white-100 min-h-screen">
      <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
      <div className="flex grow flex-col gap-2 pt-6">
      <h1 className="text-3xl font-bold">{t("Reports")}</h1>
          <text className="text-lg text-gray-600 mb-8">{t("Find reports and overview of case data")}</text>
          
      </div>
       <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCcwIcon className="h-5 w-5 mr-2" />
            Refresh Data
          </button>
        </div>
        <DateRangeSelector />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
          <SummaryCards />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <ReportCard title="Cases by Stage" icon={<BarChart2Icon className="h-6 w-6 text-indigo-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stagesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard title="Cases by Year and Month" icon={<BarChart4Icon className="h-6 w-6 text-green-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={casesByMonthChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard title="Cases by Insurer" icon={<PieChartIcon className="h-6 w-6 text-yellow-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insurersData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {insurersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard title="Cases by Agent" icon={<UserIcon className="h-6 w-6 text-red-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={casesByAgentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard title="Distribution of Case Stages Over Time" icon={<LineChartIcon className="h-6 w-6 text-purple-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stagesOverTimeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.values(CaseStage).map((stage, index) => (
                  <Area
                    type="monotone"
                    dataKey={stage}
                    stackId="1"
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    key={index}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard title="Insurer-wise Case Distribution Over Time" icon={<LineChartIcon className="h-6 w-6 text-blue-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={casesByInsurerOverTimeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(casesByInsurerOverTimeChartData[0])
                  .filter((key) => key !== "date")
                  .map((insurer, index) => (
                    <Line
                      type="monotone"
                      dataKey={insurer}
                      stroke={COLORS[index % COLORS.length]}
                      key={index}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </ReportCard>
        </div></>
        
        )}
      </div>
    </div>
  );
};

export default ReportsComponent;
