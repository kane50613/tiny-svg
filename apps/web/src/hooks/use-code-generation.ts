import { useEffect, useState } from "react";
import { prepareSvgDataForWorker } from "@/lib/svg-to-code";
import {
  codeGeneratorWorkerClient,
  type GeneratorType,
} from "@/lib/worker-utils/code-generator-worker-client";

export function useCodeGeneration(
  activeTab: string,
  compressedSvg: string,
  fileName: string
) {
  const [generatedCodes, setGeneratedCodes] = useState<Map<string, string>>(
    new Map()
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!(compressedSvg && activeTab)) {
      return;
    }

    const validGeneratorTypes: GeneratorType[] = [
      "react-jsx",
      "react-tsx",
      "vue",
      "svelte",
      "react-native",
      "flutter",
    ];

    const generateCode = async () => {
      setIsGenerating(true);

      try {
        // Prepare SVG data in main thread (DOM parsing)
        const svgData = prepareSvgDataForWorker(compressedSvg, fileName);

        // If "react" tab is active, generate both JSX and TSX
        if (activeTab === "react") {
          const [jsxCode, tsxCode] = await Promise.all([
            codeGeneratorWorkerClient.generate(
              "react-jsx",
              svgData,
              compressedSvg
            ),
            codeGeneratorWorkerClient.generate(
              "react-tsx",
              svgData,
              compressedSvg
            ),
          ]);

          setGeneratedCodes((prev) => {
            const newMap = new Map(prev);
            newMap.set("react-jsx", jsxCode);
            newMap.set("react-tsx", tsxCode);
            return newMap;
          });
        } else if (validGeneratorTypes.includes(activeTab as GeneratorType)) {
          // Generate code for other tabs
          const code = await codeGeneratorWorkerClient.generate(
            activeTab as GeneratorType,
            svgData,
            compressedSvg
          );

          setGeneratedCodes((prev) => new Map(prev).set(activeTab, code));
        }
      } catch {
        // Code generation failed silently
      } finally {
        setIsGenerating(false);
      }
    };

    // Check if we need to generate code
    if (
      activeTab === "react" ||
      validGeneratorTypes.includes(activeTab as GeneratorType)
    ) {
      generateCode();
    }
  }, [activeTab, compressedSvg, fileName]);

  return { generatedCodes, isGenerating };
}
