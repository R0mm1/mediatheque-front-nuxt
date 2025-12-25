#!/bin/bash

# Vue 2 → Vue 3 & Nuxt 2 → Nuxt 4 Migration Helper Script
# This script helps manage the migration process

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "================================"
echo "Vue 3 & Nuxt 4 Migration Helper"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function print_status() {
    echo -e "${BLUE}→${NC} $1"
}

function print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

function print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

function print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

echo "Project directory: $PROJECT_DIR"
echo ""

# Parse command argument
COMMAND=${1:-help}

case $COMMAND in
    install)
        print_status "Installing dependencies..."
        cd "$PROJECT_DIR"
        npm install
        print_success "Dependencies installed"
        ;;
    
    build)
        print_status "Building project..."
        cd "$PROJECT_DIR"
        npm run build
        print_success "Build completed"
        ;;
    
    dev)
        print_status "Starting dev server..."
        cd "$PROJECT_DIR"
        npm run dev
        ;;
    
    migrate-components)
        print_status "Running component migration script..."
        cd "$PROJECT_DIR"
        node scripts/migrate-to-composition-api.js
        print_success "Component migration complete"
        ;;
    
    cleanup-plugins)
        print_status "Cleaning up obsolete plugins..."
        cd "$PROJECT_DIR"
        bash scripts/cleanup-plugins.sh
        print_success "Plugins cleaned up"
        ;;
    
    check)
        print_status "Checking project status..."
        
        if [ -f "$PROJECT_DIR/nuxt.config.ts" ]; then
            print_success "nuxt.config.ts found"
        else
            print_warning "nuxt.config.ts not found"
        fi
        
        if [ -f "$PROJECT_DIR/tsconfig.json" ]; then
            print_success "tsconfig.json found"
        else
            print_warning "tsconfig.json not found"
        fi
        
        if [ -d "$PROJECT_DIR/components/Form" ]; then
            print_success "New Form components found"
        else
            print_warning "New Form components not found"
        fi
        
        if grep -q "vue-property-decorator" "$PROJECT_DIR/package.json"; then
            print_warning "vue-property-decorator still in package.json"
        else
            print_success "vue-property-decorator removed from package.json"
        fi
        
        if grep -q "@braid/vue-formulate" "$PROJECT_DIR/package.json"; then
            print_warning "Vue Formulate still in package.json"
        else
            print_success "Vue Formulate removed from package.json"
        fi
        ;;
    
    full)
        print_status "Running full migration setup..."
        
        print_status "1. Installing dependencies..."
        cd "$PROJECT_DIR"
        npm install
        print_success "Dependencies installed"
        
        print_status "2. Running component migration..."
        node scripts/migrate-to-composition-api.js
        print_success "Component migration complete"
        
        print_status "3. Building project..."
        npm run build
        print_success "Build completed successfully!"
        
        echo ""
        print_success "Migration setup complete!"
        echo ""
        echo "Next steps:"
        echo "  1. Review converted components"
        echo "  2. Update forms from Vue Formulate"
        echo "  3. Migrate store to Pinia"
        echo "  4. Run tests: npm test"
        echo "  5. Start dev: npm run dev"
        ;;
    
    help|--help|-h|"")
        echo "Usage: ./migrate.sh [command]"
        echo ""
        echo "Commands:"
        echo "  install              - Install npm dependencies"
        echo "  build                - Build the project"
        echo "  dev                  - Start development server"
        echo "  migrate-components   - Run component migration script"
        echo "  cleanup-plugins      - Remove obsolete plugins"
        echo "  check                - Check migration status"
        echo "  full                 - Run complete migration setup"
        echo "  help                 - Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./migrate.sh install"
        echo "  ./migrate.sh build"
        echo "  ./migrate.sh full"
        ;;
    
    *)
        print_error "Unknown command: $COMMAND"
        echo "Run './migrate.sh help' for available commands"
        exit 1
        ;;
esac
