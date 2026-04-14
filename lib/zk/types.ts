/**
 * ZK proof system interfaces — WIP, behind NEXT_PUBLIC_ENABLE_ZK feature flag.
 * Interfaces are stable; implementations are partial. See docs/zk-roadmap.md.
 */

export interface Proof {
  protocol: "groth16" | "plonk";
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
  publicSignals: string[];
}

export interface VerificationKey {
  protocol: string;
  curve: string;
  nPublic: number;
}

export interface ProverBackend {
  name: string;
  prove(witness: Uint8Array): Promise<Proof>;
  verify(proof: Proof, vk: VerificationKey): Promise<boolean>;
}
