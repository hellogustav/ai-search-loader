import React, { useState } from 'react';
import GlowAnimation from './GlowAnimation';
import GlowAnimationV1_1 from './GlowAnimationV1_1';
import GlowAnimationV2 from './GlowAnimationV2';
import GlowAnimationV3 from './GlowAnimationV3';
import GlowAnimationV4 from './GlowAnimationV4';
import GlowAnimationV5 from './GlowAnimationV5';
import GlowAnimationV6 from './GlowAnimationV6';
import GlowAnimationV7 from './GlowAnimationV7';
import GlowAnimationV8 from './GlowAnimationV8';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'v1' | 'v1.1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8'>('v1');
  const [v6SubTab, setV6SubTab] = useState<'default' | 'trail' | 'speed' | 'background' | 'trace' | 'colors' | 'large'>('default');
  const [v8SubTab, setV8SubTab] = useState<'fade' | 'slide' | 'typewriter' | 'flip' | 'blur' | 'speed' | 'custom' | 'notext'>('fade');

  return (
    <div className={`App ${isDark ? 'dark' : 'light'}`}>
      <div className="demo-container">
        <div className="header-container">
          <h1>Glow Animation Demo</h1>
          <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'v1' ? 'active' : ''}`}
            onClick={() => setActiveTab('v1')}
          >
            V1 - Particles
          </button>
          <button
            className={`tab ${activeTab === 'v1.1' ? 'active' : ''}`}
            onClick={() => setActiveTab('v1.1')}
          >
            V1.1 - Neon Trail
          </button>
          <button
            className={`tab ${activeTab === 'v2' ? 'active' : ''}`}
            onClick={() => setActiveTab('v2')}
          >
            V2 - Comet
          </button>
          <button
            className={`tab ${activeTab === 'v3' ? 'active' : ''}`}
            onClick={() => setActiveTab('v3')}
          >
            V3 - Alt Particles
          </button>
          <button
            className={`tab ${activeTab === 'v4' ? 'active' : ''}`}
            onClick={() => setActiveTab('v4')}
          >
            V4 - Flow
          </button>
          <button
            className={`tab ${activeTab === 'v5' ? 'active' : ''}`}
            onClick={() => setActiveTab('v5')}
          >
            V5 - Apple
          </button>
          <button
            className={`tab ${activeTab === 'v6' ? 'active' : ''}`}
            onClick={() => setActiveTab('v6')}
          >
            V6 - Neon Tracer
          </button>
          <button
            className={`tab ${activeTab === 'v7' ? 'active' : ''}`}
            onClick={() => setActiveTab('v7')}
          >
            V7 - Production
          </button>
          <button
            className={`tab ${activeTab === 'v8' ? 'active' : ''}`}
            onClick={() => setActiveTab('v8')}
          >
            V8 - AI Search Text
          </button>
        </div>

        {activeTab === 'v1' && (
          <>
            <h2 style={{ color: '#60a5fa', marginTop: '40px', marginBottom: '20px' }}>Version 1 - Particle Trail</h2>
            <div className="animation-wrapper">
              <h2>Default Animation</h2>
              <GlowAnimation />
            </div>
            <div className="animation-wrapper">
              <h2>Faster Animation (2s)</h2>
              <GlowAnimation duration={2} />
            </div>
            <div className="animation-wrapper">
              <h2>Without Trail</h2>
              <GlowAnimation showTrail={false} />
            </div>
            <div className="animation-wrapper">
              <h2>Without Shimmer</h2>
              <GlowAnimation showShimmer={false} />
            </div>
            <div className="animation-wrapper">
              <h2>Long Trail</h2>
              <GlowAnimation trailLength={30} />
            </div>
          </>
        )}

        {activeTab === 'v1.1' && (
          <>
            <h2 style={{ color: '#8A5CFF', marginTop: '40px', marginBottom: '20px' }}>Version 1.1 - Dynamic Neon Trail (Optimized)</h2>
            <div className="animation-wrapper">
              <h2>With @ Symbol Shape</h2>
              <GlowAnimationV1_1 />
            </div>
            <div className="animation-wrapper">
              <h2>Trail Only (No Shape)</h2>
              <GlowAnimationV1_1 hideShape={true} />
            </div>
            <div className="animation-wrapper">
              <h2>Trail Only (Reverse Direction)</h2>
              <GlowAnimationV1_1 hideShape={true} reverse={true} />
            </div>
          </>
        )}

        {activeTab === 'v2' && (
          <>
            <h2 style={{ color: '#a78bfa', marginTop: '40px', marginBottom: '20px' }}>Version 2 - Neon Comet</h2>
            <div className="animation-wrapper">
              <h2>Default Comet (4s)</h2>
              <GlowAnimationV2 />
            </div>
            <div className="animation-wrapper">
              <h2>Fast Comet (2s)</h2>
              <GlowAnimationV2 speed={2} />
            </div>
            <div className="animation-wrapper">
              <h2>Slow Comet (6s)</h2>
              <GlowAnimationV2 speed={6} />
            </div>
            <div className="animation-wrapper">
              <h2>Large Comet (300px)</h2>
              <GlowAnimationV2 size={300} />
            </div>
          </>
        )}

        {activeTab === 'v3' && (
          <>
            <h2 style={{ color: '#fbbf24', marginTop: '40px', marginBottom: '20px' }}>Version 3 - Alternative Particle Trail</h2>
            <div className="animation-wrapper">
              <h2>Default V3 Animation</h2>
              <GlowAnimationV3 />
            </div>
            <div className="animation-wrapper">
              <h2>V3 - Ultra Fast (1s)</h2>
              <GlowAnimationV3 duration={1} />
            </div>
            <div className="animation-wrapper">
              <h2>V3 - Mega Trail (50 particles)</h2>
              <GlowAnimationV3 trailLength={50} />
            </div>
            <div className="animation-wrapper">
              <h2>V3 - Pure Orb (No Effects)</h2>
              <GlowAnimationV3 showTrail={false} showShimmer={false} />
            </div>
          </>
        )}

        {activeTab === 'v4' && (
          <>
            <h2 style={{ color: '#ec4899', marginTop: '40px', marginBottom: '20px' }}>Version 4 - Flowing Colors</h2>
            <div className="animation-wrapper">
              <h2>Default Flow (3s)</h2>
              <GlowAnimationV4 />
            </div>
            <div className="animation-wrapper">
              <h2>Fast Flow (1.5s)</h2>
              <GlowAnimationV4 speed={1.5} />
            </div>
            <div className="animation-wrapper">
              <h2>Slow Flow (5s)</h2>
              <GlowAnimationV4 speed={5} />
            </div>
            <div className="animation-wrapper">
              <h2>Ultra Fast (0.8s)</h2>
              <GlowAnimationV4 speed={0.8} />
            </div>
          </>
        )}

        {activeTab === 'v5' && (
          <>
            <h2 style={{ color: '#A78BFA', marginTop: '40px', marginBottom: '20px' }}>Version 5 - Apple Intelligence</h2>
            <div className="animation-wrapper">
              <h2>Default Apple Style (4s)</h2>
              <GlowAnimationV5 />
            </div>
            <div className="animation-wrapper">
              <h2>Fast Apple Flow (2s)</h2>
              <GlowAnimationV5 speed={2} />
            </div>
            <div className="animation-wrapper">
              <h2>Slow Dreamy (6s)</h2>
              <GlowAnimationV5 speed={6} />
            </div>
            <div className="animation-wrapper">
              <h2>Ultra Smooth (8s)</h2>
              <GlowAnimationV5 speed={8} />
            </div>
          </>
        )}

        {activeTab === 'v6' && (
          <>
            <h2 style={{ color: '#7A4CFF', marginTop: '40px', marginBottom: '20px' }}>Version 6 - Neon Energy Tracer</h2>

            <div className="sub-tabs">
              <button
                className={`sub-tab ${v6SubTab === 'default' ? 'active' : ''}`}
                onClick={() => setV6SubTab('default')}
              >
                Default
              </button>
              <button
                className={`sub-tab ${v6SubTab === 'trail' ? 'active' : ''}`}
                onClick={() => setV6SubTab('trail')}
              >
                Long Trail
              </button>
              <button
                className={`sub-tab ${v6SubTab === 'speed' ? 'active' : ''}`}
                onClick={() => setV6SubTab('speed')}
              >
                Fast Speed
              </button>
              <button
                className={`sub-tab ${v6SubTab === 'background' ? 'active' : ''}`}
                onClick={() => setV6SubTab('background')}
              >
                Transparent
              </button>
              <button
                className={`sub-tab ${v6SubTab === 'trace' ? 'active' : ''}`}
                onClick={() => setV6SubTab('trace')}
              >
                No Trace
              </button>
              <button
                className={`sub-tab ${v6SubTab === 'colors' ? 'active' : ''}`}
                onClick={() => setV6SubTab('colors')}
              >
                Colors
              </button>
              <button
                className={`sub-tab ${v6SubTab === 'large' ? 'active' : ''}`}
                onClick={() => setV6SubTab('large')}
              >
                Large
              </button>
            </div>

            {v6SubTab === 'default' && (
              <div className="animation-wrapper">
                <h2>Default Neon (220px)</h2>
                <GlowAnimationV6 />
              </div>
            )}

            {v6SubTab === 'trail' && (
              <div className="animation-wrapper">
                <h2>Long Trail (50%)</h2>
                <GlowAnimationV6 tailFraction={0.5} />
              </div>
            )}

            {v6SubTab === 'speed' && (
              <div className="animation-wrapper">
                <h2>Fast Speed (speedMax: 240)</h2>
                <GlowAnimationV6 speedMin={70} speedMax={240} />
              </div>
            )}

            {v6SubTab === 'background' && (
              <div className="animation-wrapper">
                <h2>Transparent Background</h2>
                <GlowAnimationV6 background="transparent" />
              </div>
            )}

            {v6SubTab === 'trace' && (
              <div className="animation-wrapper">
                <h2>Without Static Trace</h2>
                <GlowAnimationV6 showStaticTrace={false} />
              </div>
            )}

            {v6SubTab === 'colors' && (
              <>
                <div className="animation-wrapper">
                  <h2>Cyan Neon</h2>
                  <GlowAnimationV6 hue="#22D3EE" />
                </div>
                <div className="animation-wrapper">
                  <h2>Pink Neon</h2>
                  <GlowAnimationV6 hue="#F472B6" />
                </div>
                <div className="animation-wrapper">
                  <h2>Orange Neon</h2>
                  <GlowAnimationV6 hue="#FB923C" />
                </div>
              </>
            )}

            {v6SubTab === 'large' && (
              <div className="animation-wrapper">
                <h2>Large (280px)</h2>
                <GlowAnimationV6 size={280} />
              </div>
            )}
          </>
        )}

        {activeTab === 'v7' && (
          <>
            <h2 style={{ color: '#FF9C26', marginTop: '40px', marginBottom: '20px' }}>Version 7 - Production Ready</h2>
            <div className="animation-wrapper">
              <h2>Neon Trail Animation (Reverse)</h2>
              <GlowAnimationV7 reverse={true} />
            </div>
          </>
        )}

        {activeTab === 'v8' && (
          <>
            <h2 style={{ color: '#A855F7', marginTop: '40px', marginBottom: '20px' }}>Version 8 - AI Search with Loading Text</h2>

            <div className="sub-tabs">
              <button
                className={`sub-tab ${v8SubTab === 'fade' ? 'active' : ''}`}
                onClick={() => setV8SubTab('fade')}
              >
                Fade
              </button>
              <button
                className={`sub-tab ${v8SubTab === 'slide' ? 'active' : ''}`}
                onClick={() => setV8SubTab('slide')}
              >
                Slide
              </button>
              <button
                className={`sub-tab ${v8SubTab === 'typewriter' ? 'active' : ''}`}
                onClick={() => setV8SubTab('typewriter')}
              >
                Typewriter
              </button>
              <button
                className={`sub-tab ${v8SubTab === 'flip' ? 'active' : ''}`}
                onClick={() => setV8SubTab('flip')}
              >
                Flip
              </button>
              <button
                className={`sub-tab ${v8SubTab === 'blur' ? 'active' : ''}`}
                onClick={() => setV8SubTab('blur')}
              >
                Blur
              </button>
              <button
                className={`sub-tab ${v8SubTab === 'speed' ? 'active' : ''}`}
                onClick={() => setV8SubTab('speed')}
              >
                Speed
              </button>
              <button
                className={`sub-tab ${v8SubTab === 'custom' ? 'active' : ''}`}
                onClick={() => setV8SubTab('custom')}
              >
                Custom
              </button>
              <button
                className={`sub-tab ${v8SubTab === 'notext' ? 'active' : ''}`}
                onClick={() => setV8SubTab('notext')}
              >
                No Text
              </button>
            </div>

            {v8SubTab === 'fade' && (
              <div className="animation-wrapper">
                <h2>Fade Animation</h2>
                <GlowAnimationV8 textAnimation="fade" />
              </div>
            )}

            {v8SubTab === 'slide' && (
              <div className="animation-wrapper">
                <h2>Slide Up Animation</h2>
                <GlowAnimationV8 textAnimation="slide" />
              </div>
            )}

            {v8SubTab === 'typewriter' && (
              <div className="animation-wrapper">
                <h2>Typewriter Effect</h2>
                <GlowAnimationV8 textAnimation="typewriter" />
              </div>
            )}

            {v8SubTab === 'flip' && (
              <div className="animation-wrapper">
                <h2>3D Flip Animation</h2>
                <GlowAnimationV8 textAnimation="flip" />
              </div>
            )}

            {v8SubTab === 'blur' && (
              <>
                <div className="animation-wrapper">
                  <h2>Blur Transition</h2>
                  <GlowAnimationV8 textAnimation="blur" />
                </div>
                <div className="animation-wrapper">
                  <h2>Blur + Reverse Spinner</h2>
                  <GlowAnimationV8 reverse={true} textAnimation="blur" />
                </div>
              </>
            )}

            {v8SubTab === 'speed' && (
              <>
                <div className="animation-wrapper">
                  <h2>Fast Text Change (1.5s)</h2>
                  <GlowAnimationV8 textChangeInterval={1.5} />
                </div>
                <div className="animation-wrapper">
                  <h2>Normal Speed (2.5s)</h2>
                  <GlowAnimationV8 />
                </div>
                <div className="animation-wrapper">
                  <h2>Slow Text Change (4s)</h2>
                  <GlowAnimationV8 textChangeInterval={4} textAnimation="slide" />
                </div>
                <div className="animation-wrapper">
                  <h2>Very Slow (6s)</h2>
                  <GlowAnimationV8 textChangeInterval={6} textAnimation="fade" />
                </div>
              </>
            )}

            {v8SubTab === 'custom' && (
              <>
                <div className="animation-wrapper">
                  <h2>Tech Recruiting Messages</h2>
                  <GlowAnimationV8
                    customMessages={[
                      "Searching GitHub profiles...",
                      "Analyzing code quality...",
                      "Checking tech stack match...",
                      "Reviewing open source contributions...",
                      "Evaluating problem-solving skills...",
                      "Scanning Stack Overflow reputation...",
                      "Processing coding test results...",
                      "Matching team dynamics..."
                    ]}
                    textAnimation="typewriter"
                  />
                </div>
                <div className="animation-wrapper">
                  <h2>Executive Search Messages</h2>
                  <GlowAnimationV8
                    customMessages={[
                      "Analyzing leadership experience...",
                      "Reviewing board positions...",
                      "Checking industry expertise...",
                      "Evaluating strategic vision...",
                      "Assessing cultural alignment...",
                      "Reviewing compensation expectations...",
                      "Verifying references...",
                      "Finalizing executive matches..."
                    ]}
                    textAnimation="slide"
                  />
                </div>
                <div className="animation-wrapper">
                  <h2>Design Talent Messages</h2>
                  <GlowAnimationV8
                    customMessages={[
                      "Browsing portfolios...",
                      "Evaluating design aesthetics...",
                      "Checking tool proficiency...",
                      "Reviewing case studies...",
                      "Assessing creativity levels...",
                      "Analyzing UX principles...",
                      "Matching style preferences...",
                      "Finding design unicorns..."
                    ]}
                    textAnimation="flip"
                  />
                </div>
              </>
            )}

            {v8SubTab === 'notext' && (
              <>
                <div className="animation-wrapper">
                  <h2>Spinner Only (No Text)</h2>
                  <GlowAnimationV8 showLoadingText={false} />
                </div>
                <div className="animation-wrapper">
                  <h2>Reverse Spinner (No Text)</h2>
                  <GlowAnimationV8 showLoadingText={false} reverse={true} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
