/* eslint-disable func-names */
import chai, { expect } from "chai";
import { waffleChai } from "@ethereum-waffle/chai";

chai.use(waffleChai);

export function shouldBehaveLikeGreeter(): void {
  it("should return the new greeting once it's changed", async function () {
    expect(await this.greeter.greet()).to.equal("Hello, world!");

    await this.greeter.setGreeting("Hola, mundo!");
    expect(await this.greeter.greet()).to.equal("Hola, mundo!");
  });
}
