import { DependencyContainer } from "tsyringe"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"

import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod"
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig"
import { Traders } from "@spt/models/enums/Traders"
import { References } from "./Refs/References"
import { TraderData } from "./Trader/TraderTemplate"
import { TraderUtils } from "./Refs/Utils"

import * as baseJson from "../db/base.json"
import * as questAssort from "../db/questassort.json";


class TraderTemplate implements IPreSptLoadMod, IPostDBLoadMod {
	private ref: References = new References()

	constructor() { }

	public preSptLoad(container: DependencyContainer): void {
		this.ref.preSptLoad(container)
		const ragfair = this.ref.configServer.getConfig(ConfigTypes.RAGFAIR)
		const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const traderUtils = new TraderUtils()
		const traderData = new TraderData(traderConfig, this.ref, traderUtils)

		traderData.registerProfileImage()
		traderData.setupTraderUpdateTime()

		Traders[baseJson._id] = baseJson._id
		ragfair.traders[baseJson._id] = true
	}


	public postDBLoad(container: DependencyContainer): void {
		this.ref.postDBLoad(container)
		const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const traderUtils = new TraderUtils()
		const traderData = new TraderData(traderConfig, this.ref, traderUtils)


		traderData.pushTrader()
		this.ref.tables.traders[baseJson._id].questassort = questAssort;

		traderData.addTraderToLocales(this.ref.tables,
			baseJson.name, "Father Gabriel",
			baseJson.nickname,
			baseJson.location,
			"Once thought dead, Father Gabriel now tends a ruined Orthodox church in the suburbs. More shepherd than trader, he offers faith, counsel, and what little aid he can to the lost of Tarkov."
		)

		console.log(`\x1b[94m[Echoes of Tarkov] \x1b[93m The Father Loaded   | May these bullets be blessed and your aim true`
		)
	}
}

module.exports = { mod: new TraderTemplate() }
