import { expect } from "chai";

export function shouldBehaveLikeGreeter(): void {
  it("should return the new greeting once it's changed", async function () {
    expect(await this.greeter.connect(this.signers.admin).greet()).to.equal("Hello, world!");

    await this.greeter.setGreeting("Hola, mundo!");
    expect(await this.greeter.connect(this.signers.admin).greet()).to.equal("Hola, mundo!");
  });
}
