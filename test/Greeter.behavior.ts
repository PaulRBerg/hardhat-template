import { Wallet } from "@ethersproject/wallet";
import { expect } from "chai";

export function shouldBehaveLikeGreeter(_wallets: Wallet[]): void {
  it("Should return the new greeting once it's changed", async function () {
    expect(await this.greeter.greet()).to.equal("Hello, world!");

    await this.greeter.setGreeting("Hola, mundo!");
    expect(await this.greeter.greet()).to.equal("Hola, mundo!");
  });
}
