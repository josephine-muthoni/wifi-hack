import { useState, useEffect } from 'react'
import { Wifi, Lock, Shield, Cpu, Zap, Target, Key, Globe } from 'lucide-react'
import './App.css'

function App() {
  const [wifiList, setWifiList] = useState([])
  const [selectedWifi, setSelectedWifi] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isHacking, setIsHacking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState([])

  // Mock WiFi networks
  const mockWifiNetworks = [
    { id: 1, name: 'HomeNet-Secure', strength: 90, security: 'WPA2', password: 'home1234secure' },
    { id: 2, name: 'Starbucks-Free', strength: 75, security: 'WPA', password: 'coffee2024' },
    { id: 3, name: 'Airport-WiFi', strength: 60, security: 'WEP', password: 'flysafe2024' },
    { id: 4, name: 'Neighbor_5G', strength: 85, security: 'WPA3', password: 'neighbor123' },
    { id: 5, name: 'Public-Library', strength: 70, security: 'WPA2', password: 'readbooks2024' },
    { id: 6, name: 'Xfinity-WiFi', strength: 80, security: 'WPA2', password: 'xfinity2024' },
  ]

  const scanNetworks = () => {
    setIsScanning(true)
    setWifiList([])
    
    setTimeout(() => {
      setWifiList(mockWifiNetworks)
      setIsScanning(false)
    }, 2000)
  }

  const startHack = (wifi) => {
    if (isHacking) return
    
    setSelectedWifi(wifi)
    setIsHacking(true)
    setProgress(0)
    setPassword('')
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsHacking(false)
          const foundPassword = wifi.password
          setPassword(foundPassword)
          
          // Add to history
          setHistory(prev => [
            { 
              wifi: wifi.name, 
              password: foundPassword, 
              timestamp: new Date().toLocaleTimeString(),
              security: wifi.security
            },
            ...prev.slice(0, 4)
          ])
          
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 200)
  }

  const getSecurityColor = (security) => {
    switch(security) {
      case 'WPA3': return '#10b981'
      case 'WPA2': return '#3b82f6'
      case 'WPA': return '#f59e0b'
      case 'WEP': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStrengthBars = (strength) => {
    const bars = Math.ceil(strength / 25)
    return '▮'.repeat(bars) + '▯'.repeat(4 - bars)
  }

  useEffect(() => {
    scanNetworks()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <Shield className="logo-icon" />
          <h1>WiFi Security Scanner v2.0</h1>
        </div>
        <div className="status">
          <div className="status-indicator"></div>
          <span>Online</span>
        </div>
      </header>

      <main className="main-container">
        <div className="left-panel">
          <div className="control-panel">
            <div className="panel-header">
              <Cpu className="panel-icon" />
              <h2>Control Panel</h2>
            </div>
            
            <div className="controls">
              <button 
                className="btn scan-btn"
                onClick={scanNetworks}
                disabled={isScanning}
              >
                <Zap className="btn-icon" />
                {isScanning ? 'Scanning...' : 'Scan Networks'}
              </button>
              
              <div className="stats">
                <div className="stat">
                  <Target className="stat-icon" />
                  <span>{wifiList.length} Networks Found</span>
                </div>
                <div className="stat">
                  <Lock className="stat-icon" />
                  <span>Session: 001</span>
                </div>
              </div>
            </div>
          </div>

          <div className="history-panel">
            <h3>Recent Cracks</h3>
            {history.length > 0 ? (
              <div className="history-list">
                {history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-wifi">{item.wifi}</div>
                    <div className="history-password">{item.password}</div>
                    <div className="history-time">{item.timestamp}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-history">No history yet</div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="network-panel">
            <div className="panel-header">
              <Globe className="panel-icon" />
              <h2>Available Networks</h2>
            </div>
            
            <div className="wifi-list">
              {isScanning ? (
                <div className="scanning">Scanning for networks...</div>
              ) : wifiList.length > 0 ? (
                wifiList.map(wifi => (
                  <div 
                    key={wifi.id} 
                    className={`wifi-item ${selectedWifi?.id === wifi.id ? 'selected' : ''}`}
                    onClick={() => setSelectedWifi(wifi)}
                  >
                    <div className="wifi-info">
                      <Wifi className="wifi-icon" />
                      <div className="wifi-details">
                        <div className="wifi-name">{wifi.name}</div>
                        <div className="wifi-meta">
                          <span className="security" style={{ color: getSecurityColor(wifi.security) }}>
                            {wifi.security}
                          </span>
                          <span className="strength">
                            {getStrengthBars(wifi.strength)} {wifi.strength}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn hack-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        startHack(wifi)
                      }}
                      disabled={isHacking}
                    >
                      <Key className="btn-icon" />
                      {isHacking && selectedWifi?.id === wifi.id ? 'Cracking...' : 'Crack'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-networks">No networks found</div>
              )}
            </div>
          </div>

          <div className="hacking-panel">
            <div className="panel-header">
              <Target className="panel-icon" />
              <h2>Cracking Progress</h2>
            </div>
            
            {selectedWifi ? (
              <div className="target-info">
                <div className="target-header">
                  <Wifi className="target-icon" />
                  <div>
                    <h3>{selectedWifi.name}</h3>
                    <div className="target-security">
                      Security: <span style={{ color: getSecurityColor(selectedWifi.security) }}>
                        {selectedWifi.security}
                      </span>
                    </div>
                  </div>
                </div>
                
                {isHacking && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">{progress.toFixed(1)}%</div>
                    <div className="progress-status">
                      Testing password combinations...
                    </div>
                  </div>
                )}
                
                {password && (
                  <div className="password-reveal">
                    <div className="password-label">Password Found!</div>
                    <div className="password-display">
                      <Lock className="password-icon" />
                      <code>{password}</code>
                    </div>
                    <button 
                      className="btn copy-btn"
                      onClick={() => navigator.clipboard.writeText(password)}
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-target">
                Select a network to begin cracking
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-info">
          <div className="session-id">SID: 001</div>
          <div className="status-indicators">
            <span className="status-item">Encryption: AES-256</span>
            <span className="status-item">Mode: Stealth</span>
            <span className="status-item">Threads: 8</span>
          </div>
        </div>
        <div className="warning">
          ⚠️ For educational purposes only. Unauthorized access to networks is illegal.
        </div>
      </footer>
    </div>
  )
}

export default App