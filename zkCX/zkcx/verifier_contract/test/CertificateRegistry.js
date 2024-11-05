const { expect } = require("chai");

describe("CertificateRegistry", function () {
  it("Should register and verify a proof", async function () {
    const CertificateRegistry = await ethers.getContractFactory(
      "CertificateRegistry"
    );
    const registry = await CertificateRegistry.deploy();

    await registry.registerProof("hash123");
    expect(await registry.verifyProof("hash123")).to.equal(true);
  });
});
