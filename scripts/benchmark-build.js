#!/usr/bin/env node

/**
 * Build Performance Benchmark
 *
 * Measures build times for all packages in the monorepo.
 * Run with: node scripts/benchmark-build.js
 */

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ITERATIONS = 3;
const RESULTS_FILE = path.join(__dirname, "../.build-benchmark-results.json");

function formatTime(ms) {
	if (ms < 1000) return `${ms.toFixed(0)}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
}

function measureBuildTime(command, label, iteration) {
	console.log(`\n📦 ${label} (Iteration ${iteration + 1}/${ITERATIONS})...`);
	const start = Date.now();

	try {
		execSync(command, {
			cwd: path.join(__dirname, ".."),
			stdio: "inherit",
			env: { ...process.env, FORCE_COLOR: "1" },
		});
		const duration = Date.now() - start;
		console.log(`✅ ${label} completed in ${formatTime(duration)}`);
		return { success: true, duration };
	} catch (error) {
		const duration = Date.now() - start;
		console.error(`❌ ${label} failed after ${formatTime(duration)}`);
		return { success: false, duration };
	}
}

function calculateStats(measurements) {
	const durations = measurements.map((m) => m.duration);
	const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
	const min = Math.min(...durations);
	const max = Math.max(...durations);

	return { avg, min, max, measurements };
}

async function main() {
	console.log("🚀 Build Performance Benchmark");
	console.log("================================\n");

	const results = {
		timestamp: new Date().toISOString(),
		node: process.version,
		platform: process.platform,
		arch: process.arch,
		benchmarks: {},
	};

	// Benchmark 1: Clean build
	console.log("\n=== Cold Build (no cache) ===");
	const coldBuild = [];
	for (let i = 0; i < ITERATIONS; i++) {
		// Clean before each iteration
		execSync("pnpm turbo clean", {
			cwd: path.join(__dirname, ".."),
			stdio: "inherit",
		});
		coldBuild.push(measureBuildTime("pnpm build", "Cold Build", i));
	}
	results.benchmarks.coldBuild = calculateStats(coldBuild);

	// Benchmark 2: Warm build (with cache)
	console.log("\n=== Warm Build (with cache) ===");
	const warmBuild = [];
	for (let i = 0; i < ITERATIONS; i++) {
		warmBuild.push(measureBuildTime("pnpm build", "Warm Build", i));
	}
	results.benchmarks.warmBuild = calculateStats(warmBuild);

	// Benchmark 3: Typecheck only
	console.log("\n=== TypeScript Typecheck ===");
	const typecheck = [];
	for (let i = 0; i < ITERATIONS; i++) {
		typecheck.push(measureBuildTime("pnpm typecheck", "Typecheck", i));
	}
	results.benchmarks.typecheck = calculateStats(typecheck);

	// Save results
	fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));

	// Print summary
	console.log("\n\n📊 Benchmark Summary");
	console.log("====================\n");

	for (const [name, stats] of Object.entries(results.benchmarks)) {
		const label = name
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase());
		console.log(`${label}:`);
		console.log(`  Average: ${formatTime(stats.avg)}`);
		console.log(`  Min:     ${formatTime(stats.min)}`);
		console.log(`  Max:     ${formatTime(stats.max)}`);
		console.log("");
	}

	console.log(`\n✅ Results saved to: ${RESULTS_FILE}`);

	// Calculate cache hit rate
	const coldAvg = results.benchmarks.coldBuild.avg;
	const warmAvg = results.benchmarks.warmBuild.avg;
	const improvement = ((coldAvg - warmAvg) / coldAvg) * 100;

	console.log("\n📈 Performance Metrics:");
	console.log(`  Cache improvement: ${improvement.toFixed(1)}%`);
	console.log(
		`  Target: >80% (${improvement >= 80 ? "✅ PASS" : "❌ FAIL"})`,
	);
}

main().catch((error) => {
	console.error("Benchmark failed:", error);
	process.exit(1);
});
