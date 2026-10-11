import React, { useEffect, useState } from 'react';
import { fetchStats, fetchHistory } from '../api';
import { DashboardStats, SavedRouteItem } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Navigation, Clock, Bookmark, Search, Activity, Footprints, Car, ArrowUpRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [historyItems, setHistoryItems] = useState<SavedRouteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const s = await fetchStats();
        setStats(s);
        const h = await fetchHistory(10);
        setHistoryItems(h);
      } catch (e) {
        // Ignored
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center justify-center min-h-[460px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Activity className="w-5 h-5 text-indigo-400 absolute inset-0 m-auto" />
        </div>
        <span className="mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Engine Telemetry & Analytics...</span>
      </div>
    );
  }

  const trafficData = [
    { name: 'Low', count: stats?.traffic_distribution.Low || 0, fill: '#10b981' },
    { name: 'Moderate', count: stats?.traffic_distribution.Moderate || 0, fill: '#f59e0b' },
    { name: 'High', count: stats?.traffic_distribution.High || 0, fill: '#f97316' },
    { name: 'Severe', count: stats?.traffic_distribution.Severe || 0, fill: '#ef4444' }
  ];

  const modeData = [
    { name: 'Walking 🚶', value: stats?.mode_usage.walking || 0, color: '#10b981' },
    { name: 'Car 🚗', value: stats?.mode_usage.car || 0, color: '#06b6d4' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-wider text-cyan-400 font-bold uppercase">Telemetry Stream Active</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">System Analytics & Traffic Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time aggregate telemetry of C++ graph optimizations, traffic congestion distribution, and mode usage.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Searches */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between hover:border-cyan-500/30 transition-all">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Route Searches</div>
            <div className="text-3xl font-black text-white mt-1 tracking-tight font-mono">{stats?.total_searches || 0}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Search className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Distance */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between hover:border-cyan-500/30 transition-all">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Route Distance</div>
            <div className="text-3xl font-black text-white mt-1 tracking-tight font-mono">
              {stats?.avg_distance_km || 0} <span className="text-xs font-normal text-slate-400 font-sans">km</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Navigation className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Time */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between hover:border-emerald-500/30 transition-all">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Travel Time</div>
            <div className="text-3xl font-black text-white mt-1 tracking-tight font-mono">
              {stats?.avg_travel_time_min || 0} <span className="text-xs font-normal text-slate-400 font-sans">min</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Saved Routes */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between hover:border-amber-500/30 transition-all">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saved Favorites</div>
            <div className="text-3xl font-black text-white mt-1 tracking-tight font-mono">{stats?.saved_routes_count || 0}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Distribution Bar Chart */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Traffic Congestion Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Breakdown of route congestion levels evaluated across searches.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mode Usage Pie Chart */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Transport Mode Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Share of route optimizations per vehicle type.</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Searches Table */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Recent Route Optimizations
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Last {historyItems.length} runs</span>
        </div>
        {historyItems.length === 0 ? (
          <div className="text-xs text-slate-500 py-8 text-center">No recent searches recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-bold tracking-wider uppercase text-[10px] bg-white/[0.02]">
                  <th className="p-3">Start Location</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Traffic</th>
                  <th className="p-3">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {historyItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] text-slate-300 transition-colors">
                    <td className="p-3 font-semibold text-white">{item.start_location}</td>
                    <td className="p-3 font-semibold text-white">{item.destination}</td>
                    <td className="p-3 capitalize">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px]">
                        {item.transport_mode === 'walking' ? (
                          <><Footprints className="w-3 h-3 text-emerald-400" /> Walk</>
                        ) : (
                          <><Car className="w-3 h-3 text-cyan-400" /> Car</>
                        )}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{(item.distance_m / 1000).toFixed(1)} km</td>
                    <td className="p-3 font-bold text-white font-mono">{Math.round(item.travel_time_s / 60)} min</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.traffic_level === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        item.traffic_level === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        item.traffic_level === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {item.traffic_level}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-cyan-400 font-bold">{item.route_cost?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

