import type { Proof, ProverBackend, VerificationKey } from "./types";

/**
 * ZK prover — WIP. Gated by NEXT_PUBLIC_ENABLE_ZK feature flag.
 *
 * Working:    interface contract, feature-flag gating
 * Not yet:    real snarkjs integration, circuit compilation, on-chain verify
 */
export class ZKProver implements ProverBackend {
  readonly name = "groth16-snarkjs";

  constructor() {
    if (process.env.NEXT_PUBLIC_ENABLE_ZK !== "true") {
      throw new Error(
        "ZK is disabled. Set NEXT_PUBLIC_ENABLE_ZK=true to enable (experimental).",
      );
    }
  }

  async prove(_witness: Uint8Array): Promise<Proof> {
    throw new Error(
      "ZK proving is WIP. Track: https://github.com/robodynexyz/star26/issues",
    );
  }

  async verify(_proof: Proof, _vk: VerificationKey): Promise<boolean> {
    throw new Error("ZK verification is WIP.");
  }
}
