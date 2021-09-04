import { Multiply } from '../../../../src/server/nodes/Multiply'
import { when } from "../NodeTester";

it('will multiply numbers', async () => {	
	await when(Multiply).hasInput([1,2,3])
		.assertOutput([2,4,6])
		.finish()
});