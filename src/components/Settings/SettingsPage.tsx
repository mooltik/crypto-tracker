import React from 'react';
import { ArrowLeft, Moon, Sun, Clock, Coins, Check } from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings, onBack }) => {
  
  const handleChange = (field: keyof AppSettings, value: any) => {
    onUpdateSettings({ ...settings, [field]: value });
  };

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  ];

  const intervals = [
    { value: 5000, label: '5 Seconds' },
    { value: 10000, label: '10 Seconds' },
    { value: 30000, label: '30 Seconds' },
    { value: 60000, label: '1 Minute' },
  ];

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto p-6 animate-fadeIn">
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Application Settings</h1>
      </div>

      <div className="space-y-6">
        
        {/* Appearance Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden relative shadow-lg dark:shadow-none transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Moon className="w-24 h-24 text-slate-900 dark:text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-cyan-500 dark:text-cyan-400" /> Appearance
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleChange('theme', 'dark')}
              className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-all ${
                settings.theme === 'dark' 
                  ? 'bg-slate-100 dark:bg-slate-700/50 border-cyan-500 ring-1 ring-cyan-500/50' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-full h-20 bg-slate-900 rounded-md border border-slate-700 relative overflow-hidden shadow-sm">
                <div className="absolute top-2 left-2 right-2 h-2 bg-slate-800 rounded-full"></div>
                <div className="absolute top-6 left-2 w-1/2 h-2 bg-slate-800 rounded-full"></div>
              </div>
              <span className={`font-medium ${settings.theme === 'dark' ? 'text-cyan-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Dark Mode</span>
              {settings.theme === 'dark' && <div className="absolute top-3 right-3 text-cyan-500 dark:text-cyan-400"><Check className="w-4 h-4" /></div>}
            </button>

            <button
              onClick={() => handleChange('theme', 'light')}
              className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-all ${
                settings.theme === 'light' 
                  ? 'bg-white dark:bg-slate-200/10 border-cyan-500 ring-1 ring-cyan-500/50' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-full h-20 bg-slate-100 rounded-md border border-slate-300 relative overflow-hidden shadow-sm">
                <div className="absolute top-2 left-2 right-2 h-2 bg-white rounded-full border border-slate-200"></div>
                <div className="absolute top-6 left-2 w-1/2 h-2 bg-white rounded-full border border-slate-200"></div>
              </div>
              <span className={`font-medium ${settings.theme === 'light' ? 'text-cyan-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Light Mode</span>
              {settings.theme === 'light' && <div className="absolute top-3 right-3 text-cyan-500 dark:text-cyan-400"><Check className="w-4 h-4" /></div>}
            </button>
          </div>
        </section>

        {/* Currency Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg dark:shadow-none transition-colors">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-purple-500 dark:text-purple-400" /> Default Currency
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currencies.map(curr => (
              <button
                key={curr.code}
                onClick={() => handleChange('currency', curr.code)}
                className={`px-4 py-3 rounded-lg border text-left transition-all ${
                  settings.currency === curr.code
                    ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500 text-purple-700 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <div className="text-lg font-bold mb-1">{curr.symbol} {curr.code}</div>
                <div className="text-xs opacity-70">{curr.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Data Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg dark:shadow-none transition-colors">
           <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500 dark:text-green-400" /> Data Refresh
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Auto-refresh Interval</label>
              <select 
                value={settings.refreshInterval}
                onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
              >
                {intervals.map(int => (
                  <option key={int.value} value={int.value}>{int.label}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">
                Note: Shorter intervals may result in rate limiting from public APIs.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;