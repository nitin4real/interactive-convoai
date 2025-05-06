import React from 'react';
import Spline from '@splinetool/react-spline';
import { Application, SPEObject } from '@splinetool/runtime';
import { useRTCStore } from '../../store/rtc.store';
import { useGlobalStore } from '../../store/global.store';
import { logger } from '../../utils/logger';
import { EAgentRunningStatus } from '../../types/agent';

const agentSplineCubeId = 'cube-id'; // Replace with your actual cube ID from Spline

export function AgentGlobe() {
  const [isSplineInited, setIsSplineInited] = React.useState(false);
  
  const { agentStatus, agentRunningStatus } = useRTCStore();
  const { showSubtitle } = useGlobalStore();
  
  const cube = React.useRef<SPEObject | null>(null);
  const splineRef = React.useRef<Application | null>(null);
  
  React.useEffect(() => {
    if (!cube.current || !splineRef.current) {
      return;
    }
    logger.info(
      { status: agentRunningStatus },
      '[AgentGlobe] agentRunningStatus updated'
    );
    if (
      agentRunningStatus === EAgentRunningStatus.DEFAULT ||
      agentRunningStatus === EAgentRunningStatus.RECONNECTING
    ) {
      splineRef.current.setVariable('mk0', new Date().getTime());
    } else if (agentRunningStatus === EAgentRunningStatus.LISTENING) {
      splineRef.current.setVariable('mk1', new Date().getTime());
    } else if (agentRunningStatus === EAgentRunningStatus.SPEAKING) {
      splineRef.current.setVariable('mk2', new Date().getTime());
    }
  }, [agentRunningStatus]);
  
  React.useEffect(() => {
    const handleResize = () => {
      if (!splineRef.current) {
        return;
      }
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        splineRef.current.setZoom(0.5);
        cube.current?.emitEvent('start');
      } else {
        splineRef.current.setZoom(1);
        cube.current?.emitEvent('start');
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  function onSplineLoad(spline: Application) {
    splineRef.current = spline;
    const obj = spline.findObjectById(agentSplineCubeId);
    
    if (obj) {
      cube.current = obj;
    }
    
    // Call handleResize to set initial zoom based on screen size
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const isXLarge = typeof window !== 'undefined' ? window.innerWidth > 1280 : false;
    const isLarge = typeof window !== 'undefined'
      ? window.innerWidth > 1024 && window.innerWidth < 1280
      : false;
    
    if (isMobile) {
      spline.setZoom(0.5);
    } else if (isXLarge) {
      spline.setZoom(1);
    } else if (isLarge) {
      spline.setZoom(0.8);
    } else {
      spline.setZoom(1);
    }
    setIsSplineInited(true);
  }
  
  return (
    <div className="w-full h-full">
      <Spline
        scene="/spline/scene-250216.splinecode"
        onLoad={onSplineLoad}
      />
    </div>
  );
}