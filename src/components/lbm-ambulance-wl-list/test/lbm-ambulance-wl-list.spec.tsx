import { newSpecPage } from '@stencil/core/testing';
import { LbmAmbulanceWlList } from '../lbm-ambulance-wl-list';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { WaitingListEntry } from '../../../api/ambulance-wl';

describe('lbm-ambulance-wl-list', () => {
  const sampleEntries: WaitingListEntry[] = [
    {
      id: "entry-1",
      patientId: "p-1",
      name: "Juraj Prvý",
      waitingSince: "20240203T12:00",
      estimatedDurationMinutes: 20
    }, {
      id: "entry-2",
      patientId: "p-2",
      name: "James Druhý",
      waitingSince: "20240203T12:05",
      estimatedDurationMinutes: 5
    }];

  let mock: MockAdapter;

  beforeAll(() => { mock = new MockAdapter(axios); });
  afterEach(() => { mock.reset(); });

  it('renders sample entries', async () => {
    // simulate API response using sampleEntries
    mock.onGet().reply(200, sampleEntries);

    // set proper attributes
    const page = await newSpecPage({
      components: [LbmAmbulanceWlList],
      html: `<lbm-ambulance-wl-list ambulance-id="test-ambulance" api-base="http://test/api"></lbm-ambulance-wl-list>`,
    });
    const wlList = page.rootInstance as LbmAmbulanceWlList;
    const expectedPatients = wlList?.waitingPatients?.length;

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    // use sample entries as expectation
    expect(expectedPatients).toEqual(sampleEntries.length);
    expect(items.length).toEqual(expectedPatients);
  });

  it('renders error message on network issues', async () => {
    mock.onGet().networkError();
    const page = await newSpecPage({
      components: [LbmAmbulanceWlList],  //
      html: `<lbm-ambulance-wl-list ambulance-id="test-ambulance" api-base="http://test/api"></lbm-ambulance-wl-list>`,  //
    });

    const wlList = page.rootInstance as LbmAmbulanceWlList; //
    const expectedPatients = wlList?.waitingPatients?.length

    const errorMessage =  page.root.shadowRoot.querySelectorAll(".error");
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    expect(errorMessage.length).toBeGreaterThanOrEqual(1)
    expect(expectedPatients).toEqual(0);
    expect(items.length).toEqual(expectedPatients);
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [LbmAmbulanceWlList],
      html: `<lbm-ambulance-wl-list></lbm-ambulance-wl-list>`,
    });
    const wlList = page.rootInstance as LbmAmbulanceWlList;
    const expectedPatients = wlList?.waitingPatients?.length

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedPatients);
  });
});
