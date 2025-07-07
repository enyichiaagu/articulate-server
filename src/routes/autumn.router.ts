import { autumnHandler } from "autumn-js/express";
import supabase from "../services/supabase.services.js";

const autumnRouter = autumnHandler({
	identify: async (req) => {
		const { data, error } = await supabase.auth.getUser(
			req.headers.authorization?.replace("Bearer ", "")
		);

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
