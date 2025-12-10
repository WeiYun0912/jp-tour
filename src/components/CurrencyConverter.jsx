import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaExchangeAlt, FaYenSign, FaDollarSign, FaSyncAlt } from "react-icons/fa";

// 使用免費的匯率 API
const RATE_API = "https://api.exchangerate-api.com/v4/latest/JPY";

export default function CurrencyConverter() {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // 輸入值
  const [jpyAmount, setJpyAmount] = useState("");
  const [twdAmount, setTwdAmount] = useState("");
  const [direction, setDirection] = useState("jpy-to-twd"); // jpy-to-twd 或 twd-to-jpy

  // 取得匯率
  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(RATE_API);
      if (!response.ok) throw new Error("無法取得匯率");
      const data = await response.json();
      // JPY to TWD 匯率
      const jpyToTwd = data.rates.TWD;
      setRate(jpyToTwd);
      setLastUpdate(new Date().toLocaleString("zh-TW"));
    } catch (err) {
      console.error("Error fetching rate:", err);
      setError("無法取得匯率，請稍後再試");
      // 使用備用匯率（約略值）
      setRate(0.22);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  // 處理日幣輸入
  const handleJpyChange = (value) => {
    setJpyAmount(value);
    if (value && rate) {
      const twd = (parseFloat(value) * rate).toFixed(0);
      setTwdAmount(twd);
    } else {
      setTwdAmount("");
    }
    setDirection("jpy-to-twd");
  };

  // 處理台幣輸入
  const handleTwdChange = (value) => {
    setTwdAmount(value);
    if (value && rate) {
      const jpy = (parseFloat(value) / rate).toFixed(0);
      setJpyAmount(jpy);
    } else {
      setJpyAmount("");
    }
    setDirection("twd-to-jpy");
  };

  // 快速金額按鈕
  const quickAmounts = [100, 500, 1000, 5000, 10000];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* 匯率資訊卡 */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaExchangeAlt />
            匯率換算
          </h2>
          <button
            onClick={fetchRate}
            disabled={loading}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {error ? (
          <p className="text-sm opacity-80">{error}</p>
        ) : (
          <div className="text-center">
            <p className="text-3xl font-bold mb-1">
              1 JPY = {rate ? rate.toFixed(4) : "---"} TWD
            </p>
            <p className="text-sm opacity-80">
              {lastUpdate ? `更新時間：${lastUpdate}` : "載入中..."}
            </p>
          </div>
        )}
      </div>

      {/* 換算工具 */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        {/* 日幣輸入 */}
        <div className="mb-4">
          <label className="block text-lg font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FaYenSign className="text-red-500" />
            日幣 (JPY)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={jpyAmount}
            onChange={(e) => handleJpyChange(e.target.value)}
            placeholder="輸入日幣金額"
            className="w-full px-4 py-4 text-2xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          {/* 快速金額 */}
          <div className="flex flex-wrap gap-2 mt-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleJpyChange(amount.toString())}
                className="px-4 py-2 text-base bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors font-medium"
              >
                ¥{amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* 轉換箭頭 */}
        <div className="flex justify-center my-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <FaExchangeAlt className="text-xl text-gray-500 rotate-90" />
          </div>
        </div>

        {/* 台幣輸入 */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FaDollarSign className="text-green-500" />
            台幣 (TWD)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={twdAmount}
            onChange={(e) => handleTwdChange(e.target.value)}
            placeholder="輸入台幣金額"
            className="w-full px-4 py-4 text-2xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          {/* 快速金額 */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[50, 100, 500, 1000, 2000].map((amount) => (
              <button
                key={amount}
                onClick={() => handleTwdChange(amount.toString())}
                className="px-4 py-2 text-base bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors font-medium"
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 常用金額參考 */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="text-lg font-bold text-gray-700 mb-4">常用金額參考</h3>
        <div className="space-y-3">
          {[
            { jpy: 100, desc: "飲料、小點心" },
            { jpy: 500, desc: "便當、簡餐" },
            { jpy: 1000, desc: "拉麵、定食" },
            { jpy: 3000, desc: "餐廳套餐" },
            { jpy: 10000, desc: "購物" },
          ].map((item) => (
            <div
              key={item.jpy}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div>
                <span className="text-lg font-bold text-red-600">
                  ¥{item.jpy.toLocaleString()}
                </span>
                <span className="text-base text-gray-500 ml-2">{item.desc}</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                ≈ ${rate ? Math.round(item.jpy * rate).toLocaleString() : "---"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
