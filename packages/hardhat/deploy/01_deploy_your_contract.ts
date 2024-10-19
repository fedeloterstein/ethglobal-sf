import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const owner = "0xDFbE6c0A54F9f4f758753aE56eDD02Dd92C29be3";

  await deploy("USDCMock", {
    from: deployer,
    args: [owner],
    log: true,
    autoMine: true,
  });

  const usdcMockContract = await hre.ethers.getContract<Contract>("USDCMock", deployer);
  const usdcAddress = await usdcMockContract.getAddress();
  console.log("👋 Initial usdcAddress:", usdcAddress);

  await deploy("Retirement", {
    from: deployer,
    args: [usdcAddress, owner],
    log: true,
    autoMine: true,
  });

  const retirementContract = await hre.ethers.getContract<Contract>("Retirement", deployer);
  console.log("👋 Initial retirement:", await retirementContract.getAddress());
};

export default deployYourContract;

deployYourContract.tags = ["USDCMock", "Retirement"];
