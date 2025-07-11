import type { Request } from "express";
import { autumnHandler } from "autumn-js/express";
import supabase from "../services/supabase.services.js";

const autumnRouter = autumnHandler({
	identify: async (req: Request) => {
		const token = req.cookies["nora--accessToken"];
		const { data, error } = await supabase.auth.getUser(token);
		if (!data?.user || error) return null;
		return {
			customerId: data?.user.id,
			customerData: {
				name:
					data?.user.user_metadata?.full_name ||
					data?.user.user_metadata?.name ||
					"Unknown User",
				email: data?.user.email,
			},
		};
	},
});

export default autumnRouter;
