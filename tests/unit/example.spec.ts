import { shallowMount } from "@vue/test-utils"
import SpotlightCampaign from "@/components/SpotlightCampaign.vue"

describe("SpotlightCampaign.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    const wrapper = shallowMount(SpotlightCampaign, {
      props: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
