import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import * as THREE from "three";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import type { VRM, VRMHumanoid, VRMLookAt } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

const updateCognitiveLevel = (xpAmount: number): void => {
  // Get current cognitive data
  const savedLevel = localStorage.getItem("cognitiveLevel");
  const savedXp = localStorage.getItem("cognitiveXp");
  
  const currentLevel = savedLevel ? parseInt(savedLevel) : 0;
  const currentXp = savedXp ? parseInt(savedXp) : 0;
  
  // Calculate XP needed for next level
  const xpForNextLevel = (currentLevel + 1) * 100;
  
  // Add XP and check for level up
  let newXp = currentXp + xpAmount;
  let newLevel = currentLevel;
  
  // Handle level up if needed
  if (newXp >= xpForNextLevel) {
    newLevel += 1;
    newXp -= xpForNextLevel;
    toast.success(`Level Up! You are now Level ${newLevel}!`, {
      description: "Your speaking skills are improving.",
      duration: 4000,
    });
  } else {
    toast(`+${xpAmount} XP`, {
      description: "Verbal practice enhances cognitive function.",
      duration: 2000,
    });
  }
  
  // Save updated data
  localStorage.setItem("cognitiveLevel", newLevel.toString());
  localStorage.setItem("cognitiveXp", newXp.toString());
};

const Talk = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionInterval, setSessionInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentCharacter, setCurrentCharacter] = useState<'miku' | 'rimuru'>('miku');
  const vrmRef = useRef<VRM | null>(null);
  const lookAtRef = useRef<VRMLookAt | null>(null);
  const humanoidRef = useRef<VRMHumanoid | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const { toast: uiToast } = useToast();

  // Character configurations
  const characterConfigs = {
    miku: {
      modelPath: '/models/miku.vrm',
      scale: { x: 1, y: 1, z: 1 },
      position: { y: 0 },
      rotation: { y: Math.PI }
    },
    rimuru: {
      modelPath: '/models/rimuru.vrm',
      scale: { x: 1.2, y: 1.2, z: 1.2 },
      position: { y: -0.2 },
      rotation: { y: Math.PI }
    }
  };

  const loadVRMModel = async (scene: THREE.Scene, modelPath: string) => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    return new Promise<VRM>((resolve, reject) => {
      loader.load(
        modelPath,
        async (gltf) => {
          VRMUtils.removeUnnecessaryJoints(gltf.scene);
          
          try {
            const vrm = gltf.userData.vrm;
            if (!vrm) throw new Error('VRM not found in loaded model');
            
            // Store refs
            vrmRef.current = vrm;
            lookAtRef.current = vrm.lookAt;
            humanoidRef.current = vrm.humanoid;

            // Setup model
            scene.add(vrm.scene);
            const config = characterConfigs[currentCharacter];
            
            vrm.scene.rotation.y = config.rotation.y;
            vrm.scene.position.y = config.position.y;
            vrm.scene.scale.set(config.scale.x, config.scale.y, config.scale.z);

            // Set initial expressions - normal face with subtle smile
            const expressions = vrm.expressionManager;
            if (expressions) {
              expressions.setValue('blink', 0);
              expressions.setValue('neutral', 0.7);  // Mostly neutral
              expressions.setValue('happy', 0.3);    // Subtle smile
              expressions.setValue('sad', 0);
              expressions.setValue('angry', 0);
              expressions.setValue('aa', 0);
            }

            resolve(vrm);
          } catch (error) {
            reject(error);
          }
        },
        (progress) => console.log('Loading model...', (progress.loaded / progress.total) * 100 + '%'),
        (error) => reject(error)
      );
    });
  };

  const switchCharacter = async (character: 'miku' | 'rimuru') => {
    if (character === currentCharacter) return;
    
    setCurrentCharacter(character);
    if (vrmRef.current) {
      vrmRef.current.scene.removeFromParent();
    }
    
    const scene = new THREE.Scene();
    scene.background = null;
    
    try {
      const vrm = await loadVRMModel(scene, characterConfigs[character].modelPath);
      vrmRef.current = vrm;
    } catch (error) {
      console.error('Error switching character:', error);
      toast.error('Failed to switch character');
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      30,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      20
    );
    camera.position.set(0, 1.3, 3);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0, 1.3, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.update();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x4AC6B7, 2, 6);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Load initial model
    loadVRMModel(scene, characterConfigs[currentCharacter].modelPath)
      .catch(error => console.error('Error loading initial model:', error));

    // Animation
    const clock = clockRef.current;
    let lastBlinkTime = 0;
    const BLINK_INTERVAL = 4;

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      // Update controls
      controls.update();

      // Update VRM
      if (vrmRef.current) {
        // Update animation phases
        const animationState = {
          breathPhase: 0,
          idlePhase: 0,
          blinkPhase: 0,
          headPhase: 0,
          handPhase: 0
        };
        animationState.breathPhase += delta * 2;
        animationState.idlePhase += delta * 0.5;
        animationState.headPhase += delta * 0.3;
        animationState.handPhase += delta * 0.4;

        // Head look-at target with smooth movement
        if (lookAtRef.current) {
          const targetObj = new THREE.Object3D();
          const smoothFactor = 0.1;
          
          // Add subtle natural head movement
          const headOffsetX = Math.sin(animationState.headPhase) * 0.1;
          const headOffsetY = Math.cos(animationState.headPhase * 0.7) * 0.1;
          
          const targetX = mouseRef.current.x * 1.5 + headOffsetX;
          const targetY = mouseRef.current.y * 1.5 + headOffsetY;
          
          targetObj.position.lerp(
            new THREE.Vector3(targetX, targetY, -1),
            smoothFactor
          );
          lookAtRef.current.target = targetObj;
          
          lookAtRef.current.yaw = targetX * 0.3;
          lookAtRef.current.pitch = targetY * 0.3;
        }

        // Auto blink with natural timing
        const expressions = vrmRef.current.expressionManager;
        if (expressions) {
          if (elapsed - lastBlinkTime > BLINK_INTERVAL) {
            expressions.setValue('blink', 1);
            setTimeout(() => {
              if (vrmRef.current?.expressionManager) {
                vrmRef.current.expressionManager.setValue('blink', 0);
              }
            }, 150);
            lastBlinkTime = elapsed + (Math.random() * 2 - 1);
          }

          // Maintain normal face with subtle smile
          expressions.setValue('neutral', 0.7 + Math.sin(animationState.breathPhase) * 0.1);
          expressions.setValue('happy', 0.3 + Math.sin(animationState.breathPhase) * 0.1);
          
          // Very subtle mouth movement
          const mouthOpen = Math.sin(animationState.breathPhase * 1.5) * 0.05 + 0.05;
          expressions.setValue('aa', mouthOpen);
        }

        // Natural breathing and body movement
        if (humanoidRef.current) {
          // Breathing animation
          const breath = Math.sin(animationState.breathPhase) * 0.03;
          const chest = humanoidRef.current.getNormalizedBoneNode('chest');
          const spine = humanoidRef.current.getNormalizedBoneNode('spine');
          
          if (chest) {
            chest.rotation.x = breath;
            chest.rotation.z = breath * 0.1;
            // Add subtle side-to-side movement
            chest.rotation.y = Math.sin(animationState.idlePhase) * 0.02;
          }
          if (spine) {
            spine.rotation.x = breath * 0.5;
            spine.rotation.z = breath * 0.05;
            // Add subtle twisting
            spine.rotation.y = Math.sin(animationState.idlePhase * 0.7) * 0.01;
          }

          // Natural hand and arm movements
          const leftHand = humanoidRef.current.getNormalizedBoneNode('leftHand');
          const rightHand = humanoidRef.current.getNormalizedBoneNode('rightHand');
          const leftUpperArm = humanoidRef.current.getNormalizedBoneNode('leftUpperArm');
          const rightUpperArm = humanoidRef.current.getNormalizedBoneNode('rightUpperArm');
          
          if (leftHand) {
            // Base downward position with subtle movement
            leftHand.rotation.x = -1.5 + Math.sin(animationState.handPhase) * 0.02;
            leftHand.rotation.y = 0.1 + Math.sin(animationState.handPhase * 0.7) * 0.02;
            leftHand.rotation.z = 0.1 + Math.sin(animationState.handPhase * 0.5) * 0.01;
          }
          if (rightHand) {
            rightHand.rotation.x = -1.5 + Math.sin(animationState.handPhase * 1.2) * 0.02;
            rightHand.rotation.y = -0.1 + Math.sin(animationState.handPhase * 0.9) * 0.02;
            rightHand.rotation.z = -0.1 + Math.sin(animationState.handPhase * 0.6) * 0.01;
          }
          if (leftUpperArm) {
            // Subtle arm movement
            leftUpperArm.rotation.x = -0.5 + Math.sin(animationState.handPhase * 0.5) * 0.02;
            leftUpperArm.rotation.y = 0.3 + Math.sin(animationState.handPhase * 0.3) * 0.01;
          }
          if (rightUpperArm) {
            rightUpperArm.rotation.x = -0.5 + Math.sin(animationState.handPhase * 0.7) * 0.02;
            rightUpperArm.rotation.y = -0.3 + Math.sin(animationState.handPhase * 0.4) * 0.01;
          }

          // Subtle neck movement
          const neck = humanoidRef.current.getNormalizedBoneNode('neck');
          if (neck) {
            neck.rotation.x = Math.sin(animationState.idlePhase * 0.5) * 0.01;
            neck.rotation.y = Math.sin(animationState.idlePhase * 0.3) * 0.02;
          }
        }

        vrmRef.current.update(delta);
      }

      // Animate point light with smoother variation
      pointLight.intensity = 1.5 + Math.sin(elapsed * 1.5) * 0.3;
      
      renderer.render(scene, camera);
    };
    animate();

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseRef.current = { x, y };
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      if (vrmRef.current) {
        vrmRef.current.scene.removeFromParent();
      }
      controls.dispose();
    };
  }, [currentCharacter]);

  const toggleMicrophone = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      uiToast({
        title: "Microphone turned off",
        description: "Voice interaction stopped",
      });
      
      // Stop timer and award XP based on time spent
      if (sessionInterval) {
        clearInterval(sessionInterval);
        setSessionInterval(null);
        
        // Award 1 XP for each 5 seconds of conversation (up to a maximum)
        const xpEarned = Math.min(Math.floor(sessionTime / 5), 50);
        if (xpEarned > 0) {
          updateCognitiveLevel(xpEarned);
        }
        
        // Reset timer
        setSessionTime(0);
      }
    } else {
      // Start listening
      setIsListening(true);
      uiToast({
        title: "Microphone turned on",
        description: "You can start talking now",
      });
      
      // Start timer for XP tracking
      const interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      setSessionInterval(interval);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4 animate-fade-in">
            Talk with {currentCharacter === 'miku' ? 'Miku' : 'Rimuru'}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a conversation with your 3D AI companion. Click the microphone button to start talking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div 
            ref={containerRef} 
            className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-black/60 to-gray-900/60 border border-gray-800 shadow-lg shadow-primary/20 relative"
          />
          
          <div className="flex justify-center items-center gap-4">
            <Button
              onClick={toggleMicrophone}
              className={`p-6 rounded-full transition-all hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/30' 
                  : 'bg-gradient-to-r from-blue-600 to-primary-600 hover:from-blue-500 hover:to-primary-500 shadow-lg shadow-primary/30'
              }`}
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
            
            <div className="flex gap-2">
              <Button
                onClick={() => switchCharacter('miku')}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentCharacter === 'miku'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Miku
              </Button>
              <Button
                onClick={() => switchCharacter('rimuru')}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentCharacter === 'rimuru'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Rimuru
              </Button>
            </div>
            
            {isListening && (
              <div className="bg-black/40 px-4 py-2 rounded-full text-sm text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Recording: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, "0")}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Talk;
