import EventBus = require("@vertx/eventbus-bridge-client.js");
import * as vscode from "vscode";
import axios from "axios";
import {readConfig, SourceMarkerConfig} from "./sourceMarkerConfig";
import LiveInstrumentManager from "./instruments/liveInstrumentManager";

interface Record {
    location: RecordLocation
    metadata: any
    name: string
    registration: string
    status: string
    type: string
}

interface RecordLocation {
    endpoint: string
}

export class SourceMarker {
    config?: SourceMarkerConfig

    token?: string;
    eventBus?: EventBus;

    records?: Record[];

    liveInstrumentManager?: LiveInstrumentManager;

    constructor() {

    }

    async init(config: vscode.WorkspaceConfiguration) {
        this.config = readConfig(config);

        let host = this.config.host;
        let accessToken = this.config.accessToken;

        console.log(`Host: ${host}, accessToken: ${accessToken}`);

        this.token = await axios.get(`${host}/api/new-token?access_token=${accessToken}`)
            .then(response => response.data)
            .catch(error => {
                // TODO: Handle error
                console.log(error);
            });

        this.eventBus = new EventBus(host + "/marker/eventbus");
        this.eventBus.enableReconnect(true);

        await new Promise<void>((resolve, reject) => this.eventBus!.onopen = resolve);

        console.log("Connected to Source++ Platform");

        let _ = await this.eventBusSend("spp.platform.status.marker-connected", {
            instanceId: "test",
            connectionTime: Date.now(),
            meta: {}
        }, {});

        await this.discoverAvailableServices();

        // TODO: initMonitor

        vscode.window.showInformationMessage("You have successfully connected. Source++ is now fully activated.")


    }

    async discoverAvailableServices() {
        this.log("Discovering available services");

        let getRecordsResponse = await this.eventBusSend("get-records", null, {});
        this.records = getRecordsResponse.body;

        this.log(`Discovered ${this.records!.length} services`);

        if (this.records!.some(r => r.type === "spp.service.live-service")) {
            this.log("Live service available");

            // TODO: Live service
        } else {
            this.log("Live service unavailable");
        }

        if (this.records!.some(r => r.type === "spp.service.live-instrument")) {
            this.log("Live instruments available");

            this.liveInstrumentManager = new LiveInstrumentManager(this);
            // TODO: Live instruments
        } else {
            this.log("Live instruments unavailable");
        }

        if (this.records!.some(r => r.type === "spp.service.live-view")) {
            this.log("Live views available");

            // TODO: Live views
        } else {
            this.log("Live views unavailable");
        }
    }

    async eventBusSend(address: string, message: any, headers: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            headers["auth-token"] = this.token;
            this.eventBus!.send(address, message, headers, (err: any, message: any) => {
                if (err) {
                    return reject(err);
                }

                resolve(message);
            });
        });
    }

    eventBusRegisterHandler(address: string, handler: (message: any) => void) {
        this.eventBus!.registerHandler(address, {
            "auth-token": this.token
        }, handler);
    }

    log(message: string) {
        console.log(message);
    }
}