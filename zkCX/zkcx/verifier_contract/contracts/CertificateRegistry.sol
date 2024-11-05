// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct CertificateProof {
        string serialNumberHash;
        address owner;
        uint256 timestamp;
    }

    mapping(string => CertificateProof) public proofs;

    function registerProof(string memory serialNumberHash) public {
        require(proofs[serialNumberHash].owner == address(0), "Proof already exists");
        proofs[serialNumberHash] = CertificateProof(serialNumberHash, msg.sender, block.timestamp);
    }

    function verifyProof(string memory serialNumberHash) public view returns (bool) {
        return proofs[serialNumberHash].owner != address(0);
    }
}
